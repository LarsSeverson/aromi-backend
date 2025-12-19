import type { ScopedStackProps } from '../../common/types.js'

export interface GlobalStackProps extends Omit<ScopedStackProps, 'config'> {}