#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TaskMasterInfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();

new TaskMasterInfrastructureStack(app, "TaskMasterInfrastructureStack", {
  env: {
    account: "171158265889",
    region: "eu-central-1",
  },
  description: "TaskMaster Pro - MultiSaaS Platform Infrastructure",
});

app.synth();
