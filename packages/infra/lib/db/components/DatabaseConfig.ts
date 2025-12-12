import { AuroraCapacityUnit, AuroraPostgresEngineVersion, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds'
import { BaseConfig } from '../../BaseConfig.js'
import { Port } from 'aws-cdk-lib/aws-ec2'

export class DatabaseConfig extends BaseConfig {
  static readonly ENGINE = DatabaseClusterEngine.auroraPostgres({
    version: AuroraPostgresEngineVersion.VER_17_6
  })

  static readonly MIN_CAPACITY = 0
  static readonly MAX_CAPACITY = AuroraCapacityUnit.ACU_2

  static readonly DB_PORT = Port.tcp(5432)
}