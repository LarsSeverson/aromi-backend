import type { BaseComponentProps, BaseStackProps } from '../types.js'
import type { ECRStack } from './ECRStack.js'

export interface ServerECRComponentProps extends BaseComponentProps {}

export interface ECRStackProps extends BaseStackProps {}

export interface SynthECRProps extends BaseStackProps {}

export interface SynthECRStackOutput {
  ecr: ECRStack
}