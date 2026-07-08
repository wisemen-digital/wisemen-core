import { Injectable } from "@nestjs/common";
import { EvaluationContext, OpenFeature, TransactionContext } from "@openfeature/nestjs-sdk";

@Injectable()
export class FeatureFlagContext {

  run<Ctx extends TransactionContext>(ctx: Ctx, cb: () => void): void {
    OpenFeature.setTransactionContext(ctx, cb)
  }

  getOrFail(): EvaluationContext {
    return OpenFeature.getTransactionContext()
  }
} 