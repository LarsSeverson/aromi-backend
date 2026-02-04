import type { AggFragranceTraitVoteRow, CombinedTraitRow2, FragranceTraitVoteRow } from '@aromi/shared'
import { DBTraitToGQLTrait } from '@src/features/traits/utils/mappers.js'
import type { FragranceResolvers, FragranceTraitVote, TraitVoteDistribution } from '@src/graphql/gql-types.js'
import { RequestResolver } from '@src/resolvers/RequestResolver.js'
import type { ResolverReturn } from '@src/utils/types.js'
import { okAsync, ResultAsync } from 'neverthrow'

type Query = FragranceResolvers['traits']

export class FragranceTraitsResolver extends RequestResolver<Query> {
  resolve () {
    return ResultAsync
      .combine([
        this.getTraitRows(),
        this.getTraitVoteRows(),
        this.getMyTraitVoteRows()
      ])
      .map(
        ([traits, votes, myVotes]) => this.mapToOutput(traits, votes, myVotes)
      )
  }

  getTraitRows () {
    const { id } = this.parent
    const { loaders } = this.context

    const { fragrances } = loaders

    return fragrances.loadTraits(id)
  }

  getTraitVoteRows () {
    const { id } = this.parent
    const { loaders } = this.context

    const { fragrances } = loaders

    return fragrances.loadTraitVotes(id)
  }

  getMyTraitVoteRows () {
    const { id } = this.parent
    const { me, loaders } = this.context

    const userId = me?.id
    const { fragrances } = loaders

    if (userId == null) return okAsync([])

    return fragrances.loadUserTraitVotes(id, userId)
  }

  private mapToOutput (
    traits: CombinedTraitRow2[],
    votes: AggFragranceTraitVoteRow[],
    myVotes: FragranceTraitVoteRow[]
  ): ResolverReturn<Query> {
    const votesMap = new Map(votes.map(vote => [vote.traitOptionId, vote.votes]))
    const myVotesMap = new Map(myVotes.map(vote => [vote.traitTypeId, vote.traitOptionId]))

    const groupedTraits = this.groupTraitsById(traits)

    return Array
      .from(groupedTraits.entries())
      .map(
        ([traitId, group]) => {
          const { id, name } = group.at(0)!
          const options = this.getOptions(group)
          const stats = this.getStats(group, votesMap)
          const myVote = this.getMyVote(traitId, group, myVotesMap)

          return {
            id: `${traitId}:${this.parent.id}`,
            typeId: id,
            type: DBTraitToGQLTrait[name],
            name,
            options,
            stats,
            myVote,

            fragrance: this.parent
          }
        }
      )
  }

  private getOptions (
    group: CombinedTraitRow2[]
  ) {
    return group.map(
      row => {
        const { optionId, optionLabel, optionScore } = row

        return {
          id: optionId,
          label: optionLabel,
          score: optionScore
        }
      }
    )
  }

  private getStats (
    group: CombinedTraitRow2[],
    votesMap: Map<string, number>
  ) {
    const distribution = this.getDistribution(group, votesMap)
    const totalVotes = this.getTotalVotes(distribution)
    const averageScore = this.getAverageScore(distribution, totalVotes)

    return { distribution, totalVotes, averageScore }
  }

  private groupTraitsById (traits: CombinedTraitRow2[]) {
    return traits.reduce(
      (acc, trait) => {
        const { id } = trait

        if (!acc.has(id)) {
          acc.set(id, [])
        }

        acc.get(id)?.push(trait)

        return acc
      },
      new Map<string, CombinedTraitRow2[]>()
    )
  }

  private getDistribution (
    rows: CombinedTraitRow2[],
    votesMap: Map<string, number>
  ): TraitVoteDistribution[] {
    return rows.map(
      row => {
        const { optionId, optionLabel, optionScore } = row
        const votes = votesMap.get(optionId) ?? 0

        return {
          option: {
            id: optionId,
            label: optionLabel,
            score: optionScore
          },
          votes
        }
      }
    )
  }

  private getTotalVotes (
    distribution: TraitVoteDistribution[]
  ) {
    return distribution.reduce((acc, item) => acc + item.votes, 0)
  }

  private getAverageScore (
    distribution: TraitVoteDistribution[],
    totalVotes: number
  ) {
    if (totalVotes === 0) return 0

    const totalScore = distribution.reduce(
      (acc, item) => acc + (item.option.score * item.votes),
      0
    )

    return totalScore / totalVotes
  }

  private getMyVote (
    traitId: string,
    group: CombinedTraitRow2[],
    myVotesMap: Map<string, string>
  ): FragranceTraitVote | null {
    const optionId = myVotesMap.get(traitId)
    if (optionId == null) return null

    const option = group.find(o => o.optionId === optionId)
    if (option == null) return null

    return {
      id: `${traitId}:${this.parent.id}`,
      type: DBTraitToGQLTrait[option.name],
      option: {
        id: option.optionId,
        label: option.optionLabel,
        score: option.optionScore
      }
    }
  }
}