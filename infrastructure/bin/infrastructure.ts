#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TaskMasterInfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();

new TaskMasterInfrastructureStack(app, "TaskMasterInfrastructureStack", {
  env: {
    account: "your_AWS_account",
    region: "eu-central-1",
  },
  description: "TaskMaster Pro - MultiSaaS Platform Infrastructure",
});

app.synth();




