#!/usr/bin/env node

import "source-map-support/register";
import { App } from "aws-cdk-lib";

import { DemarchenacStack } from "lib/demarchenacStack";

const app = new App();

new DemarchenacStack(app, "dev", {
  env: {
    account: "279505110089", // replace with your AWS Account ID or use process.env
    region: "us-east-1",
  },
  apiStageName: "dev",
});
