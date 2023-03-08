#!/usr/bin/env node

import "source-map-support/register";
import { App } from "aws-cdk-lib";

import { DemarchenacStack } from "lib/demarchenacStack";

const app = new App();

new DemarchenacStack(app, "dev", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  apiStageName: "dev",
});
