// Re-export Playwright's assertion entrypoint so consumers import it from one place.
export { expect } from '@playwright/test'

// Auth
export type { AuthSetupOptions } from '@/auth/createAuthSetup'
export { createAuthSetup } from '@/auth/createAuthSetup'

// Builders
export { BuilderBase } from '@/builders/builderBase'

// Fixtures
export type {
  BaseTestFixtures,
  CreateTestOptions,
} from '@/fixtures/createTest'
export { createTest } from '@/fixtures/createTest'

// Mocking — CRUD handler factory
export type { CrudHandlerFactoryOptions } from '@/mocking/crudHandlerFactory'
export { CrudHandlerFactory } from '@/mocking/crudHandlerFactory'

// Mocking — error response builders
export type {
  ApiErrorObject,
  ApiExpectedError,
} from '@/mocking/errors/apiError.builder'
export { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'
export { BadRequestBuilder } from '@/mocking/errors/badRequest.builder'
export { ConflictBuilder } from '@/mocking/errors/conflict.builder'
export { ForbiddenBuilder } from '@/mocking/errors/forbidden.builder'
export { NotFoundBuilder } from '@/mocking/errors/notFound.builder'
export { ServerErrorBuilder } from '@/mocking/errors/serverError.builder'
export { UnauthorizedBuilder } from '@/mocking/errors/unauthorized.builder'

// Page objects
export { BreadcrumbTestUtil } from '@/page-objects/breadcrumb.page-object'
export { BulkActionsUtil } from '@/page-objects/bulkActions.page-object'
export { DialogTestUtil } from '@/page-objects/dialog.page-object'
export { FormTestUtil } from '@/page-objects/form.page-object'
export { MapTestUtil } from '@/page-objects/map.page-object'
export { MultiStepFormUtil } from '@/page-objects/multiStepForm.page-object'
export { PaginationTestUtil } from '@/page-objects/pagination.page-object'
export { SearchFilterUtil } from '@/page-objects/searchFilter.page-object'
export { StateTestUtil } from '@/page-objects/state.page-object'
export { TabTestUtil } from '@/page-objects/tab.page-object'
export { TableTestUtil } from '@/page-objects/table.page-object'
export { TestUtil } from '@/page-objects/testUtil.page-object'
export { ToastTestUtil } from '@/page-objects/toast.page-object'

// Utils
export { runAccessibilityCheck } from '@/utils/a11y.util'
export type { ConsoleMonitoringOptions } from '@/utils/console.util'
export { setupConsoleMonitoring } from '@/utils/console.util'
export { setupContextWithCoverage } from '@/utils/coverage.util'
export {
  PermissionContext,
  permissionContext,
} from '@/utils/permissionContext.util'
export { setupWebSocketMock } from '@/utils/websocket.util'
