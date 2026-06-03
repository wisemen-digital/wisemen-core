import { HttpStatus } from "@nestjs/common";
import { describe, it } from "node:test";
import { ApiErrorStatus, getApiErrorStatusMetadata } from "../api-error-status.decorator.js";
import { expect } from "expect";

describe('@ApiErrorStatus unit test', () => {
  it('adds retrievable metadata on the class in which the status is defined', () => {
    class TestClass {
      @ApiErrorStatus(HttpStatus.OK)
      status: HttpStatus
    }

    const status = getApiErrorStatusMetadata(TestClass.prototype)
    expect(status).toBe(HttpStatus.OK)
  })
})  