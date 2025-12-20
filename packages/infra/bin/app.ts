import { App } from 'aws-cdk-lib'
import { FoundationStack } from '../lib/foundation/FoundationStack.js'
import { DataStack } from '../lib/data/DataStack.js'
import { loadConfig } from '../config/index.js'
import { EdgeStack } from '../lib/edge/EdgeStack.js'
import { IdentityStack } from '../lib/identity/IdentityStack.js'
import { ApplicationStack } from '../lib/application/ApplicationStack.js'
import { DnsStack } from '../lib/dns/DnsStack.js'
import { ManagementStack } from '../lib/management/ManagementStack.js'

const app = new App({ autoSynth: true })

const config = loadConfig(app)

const foundation = new FoundationStack({ scope: app, config })

const identity = new IdentityStack({ scope: app, config })
const dns = new DnsStack({ scope: app, config })

const data = new DataStack({ scope: app, config, foundationStack: foundation })

const application = new ApplicationStack({
  scope: app,
  config,
  foundationStack: foundation,
  identityStack: identity,
  dataStack: data
})

const edge = new EdgeStack({
  scope: app,
  config,

  dnsStack: dns,
  dataStack: data,
  applicationStack: application
})

const management = new ManagementStack({
  scope: app,
  config,
  foundationStack: foundation,
  dataStack: data
})

data.addDependency(foundation)

application.addDependency(foundation)
application.addDependency(identity)
application.addDependency(data)

edge.addDependency(application)

management.addDependency(foundation)
management.addDependency(data)

app.synth()
