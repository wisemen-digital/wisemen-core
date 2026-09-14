import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'
import type { Router } from 'vue-router'

import {
  DEFAULT_MAX_SUB_ACTIONS,
  DEFAULT_MIN_APPLICABILITY_SCORE,
  DEFAULT_MIN_SEARCH_INPUT_LENGTH,
  DISABLED_GROUPING_SCORE_GROUP_PRIORITY_THRESHOLD,
  SCORE_GROUP_PRIORITY_THRESHOLD,
} from '#const/index.ts'
import { setIsAuthenticated } from '#createActions.ts'
import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import {
  applicableActions,
  resolveApplicable,
} from '#utils/resolveActions.util.ts'

let nextId = 0

function makeAction(overrides: Partial<Action> = {}): Action {
  nextId += 1

  return {
    id: `action-${nextId}`,
    name: 'Action',
    ...overrides,
  }
}

function makeCtx(overrides: Partial<ActionContext> = {}): ActionContext {
  return {
    getPaginationOffsetForSubActionId: () => null,
    hasActiveDialogs: () => false,
    hasTargetedModelsOfType: () => false,
    isRouteActive: () => false,
    allModels: [],
    clearTableSelection: (): void => {},
    focusedModels: [],
    metadata: {},
    models: [],
    router: {} as unknown as Router,
    searchInput: '',
    selectedModels: [],
    tableSelection: null,
    targetedModelOfType: () => null,
    targetedModelOfTypeOrThrow: (): never => {
      throw new Error('not stubbed in test context')
    },
    targetedModelsOfType: () => [],
    ...overrides,
  }
}

function ids(actions: Action[]): string[] {
  return actions.map((action) => action.id)
}

// Regression scenario: searching "John" for a company named "John's" and a
// user named "John Doe" score within the same tier, but by default the User
// group's higher priority (lower number) pushes "John Doe" above "John's"
// even though "John's" is the closer match.
function makeJohnActions(): [Action, Action] {
  const johnsCompany = makeAction({
    id: 'johns-company',
    name: 'John\'s',
    group: {
      priority: 10,
    },
  })
  const johnDoeUser = makeAction({
    id: 'john-doe-user',
    name: 'John Doe',
    group: {
      priority: 1,
    },
  })

  return [
    johnsCompany,
    johnDoeUser,
  ]
}

describe('resolveApplicable', () => {
  beforeEach(() => {
    setIsAuthenticated(true)
  })

  it('hides an action when isApplicable returns false', () => {
    const action = makeAction({
      isApplicable: () => false,
    })

    expect(resolveApplicable(action, makeCtx())).toBeFalsy()
  })

  it('hides an action when unauthenticated and availableWhenUnauthenticated is not set', () => {
    setIsAuthenticated(false)

    const action = makeAction()

    expect(resolveApplicable(action, makeCtx())).toBeFalsy()
  })

  it('keeps an action visible when unauthenticated and availableWhenUnauthenticated is true', () => {
    setIsAuthenticated(false)

    const action = makeAction({
      availableWhenUnauthenticated: true,
    })

    expect(resolveApplicable(action, makeCtx())).toBeTruthy()
  })

  it('hides an action in the command menu when disabledReason returns a string', () => {
    const action = makeAction({
      disabledReason: () => 'Not allowed',
    })

    expect(resolveApplicable(action, makeCtx({
      menuType: 'commandMenu',
    }))).toBeFalsy()
  })

  it('keeps a disabled action visible outside the command menu', () => {
    const action = makeAction({
      disabledReason: () => 'Not allowed',
    })

    expect(resolveApplicable(action, makeCtx({
      menuType: 'contextualMenu',
    }))).toBeTruthy()
  })

  it('hides an onlyVisibleThroughSearch action inside a menu with no search input', () => {
    const action = makeAction({
      onlyVisibleThroughSearch: true,
    })

    expect(resolveApplicable(action, makeCtx({
      menuType: 'commandMenu',
      searchInput: '',
    }))).toBeFalsy()
  })

  it('shows an onlyVisibleThroughSearch action once the user has typed something', () => {
    const action = makeAction({
      onlyVisibleThroughSearch: true,
    })

    expect(resolveApplicable(action, makeCtx({
      menuType: 'commandMenu',
      searchInput: 'a',
    }))).toBeTruthy()
  })
})

describe('applicableActions > filtering', () => {
  beforeEach(() => {
    setIsAuthenticated(true)
  })

  it('deduplicates actions by id, keeping the first occurrence', async () => {
    const first = makeAction({
      id: 'dup',
      name: 'First',
    })
    const second = makeAction({
      id: 'dup',
      name: 'Second',
    })

    const result = await applicableActions([
      first,
      second,
    ], makeCtx())

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('First')
  })

  it('deduplicates actions by key, keeping the first occurrence', async () => {
    const first = makeAction({
      name: 'First',
      key: 'shared-key',
    })
    const second = makeAction({
      name: 'Second',
      key: 'shared-key',
    })

    const result = await applicableActions([
      first,
      second,
    ], makeCtx())

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('First')
  })

  it('drops actions that are not applicable', async () => {
    const visible = makeAction({
      name: 'Visible',
    })
    const hidden = makeAction({
      isApplicable: () => false,
      name: 'Hidden',
    })

    const result = await applicableActions([
      visible,
      hidden,
    ], makeCtx())

    expect(result.map((a) => a.name)).toEqual([
      'Visible',
    ])
  })
})

describe('applicableActions > sorting', () => {
  beforeEach(() => {
    setIsAuthenticated(true)
  })

  describe('lifted sub-actions vs top-level actions', () => {
    it('lets a lifted action outrank a top-level action when it is a meaningfully better match', async () => {
      // Regression test for a real UX bug: searching "li" surfaced a
      // top-level "Toggle Sidebar" (a weak subsequence match) above a lifted
      // "Light Mode" (a near-exact prefix match), because lifted actions
      // used to sort below top-level ones unconditionally.
      const appearance = makeAction({
        id: 'appearance',
        name: 'Appearance',
      })
      const toggleSidebar = makeAction({
        id: 'toggle-sidebar',
        name: 'Toggle Sidebar',
      })
      const lightMode = makeAction({
        id: 'light-mode',
        name: 'Light Mode',
        parentAction: appearance,
      })

      const result = await applicableActions([
        toggleSidebar,
        lightMode,
      ], makeCtx({
        searchInput: 'li',
      }))

      expect(ids(result)).toEqual([
        'light-mode',
        'toggle-sidebar',
      ])
    })

    it('still lets a top-level action win over an equally well-matched lifted action', async () => {
      // The PARENT_ACTION_SCORE_PENALTY acts as a soft handicap: for a tied
      // match, the top-level action keeps the edge.
      const parent = makeAction({
        id: 'parent',
        name: 'Parent',
      })
      const topLevel = makeAction({
        id: 'top',
        name: 'Refresh Data',
      })
      const lifted = makeAction({
        id: 'lifted',
        name: 'Refresh Data',
        parentAction: parent,
      })

      const result = await applicableActions([
        lifted,
        topLevel,
      ], makeCtx({
        searchInput: 'refresh data',
      }))

      expect(ids(result)).toEqual([
        'top',
        'lifted',
      ])
    })
  })

  describe('isGroupingDisabled', () => {
    it('lets group priority break a tie within the same score tier by default', async () => {
      const result = await applicableActions(makeJohnActions(), makeCtx({
        searchInput: 'John',
      }))

      expect(ids(result)).toEqual([
        'john-doe-user',
        'johns-company',
      ])
    })

    it('still lets group priority break a near-tied score when isGroupingDisabled is true', async () => {
      // "John's" and "John Doe" score within a few thousandths of each other
      // (both are prefix matches, differing only by string length) — well
      // inside DISABLED_GROUPING_SCORE_GROUP_PRIORITY_THRESHOLD, so group
      // priority still decides even though grouping is disabled.
      const result = await applicableActions(
        makeJohnActions(),
        makeCtx({
          searchInput: 'John',
        }),
        undefined,
        undefined,
        true,
      )

      expect(ids(result)).toEqual([
        'john-doe-user',
        'johns-company',
      ])
    })

    it('lets a real relevance gap win over group priority when isGroupingDisabled is true, unlike grouped mode', async () => {
      // The gap between these scores is bigger than
      // DISABLED_GROUPING_SCORE_GROUP_PRIORITY_THRESHOLD (so disabled mode
      // treats them as different tiers and score wins), but still smaller
      // than SCORE_GROUP_PRIORITY_THRESHOLD (so grouped mode treats them as
      // tied and group priority wins instead).
      const gap = (SCORE_GROUP_PRIORITY_THRESHOLD + DISABLED_GROUPING_SCORE_GROUP_PRIORITY_THRESHOLD) / 2

      const betterScoreBadPriority = makeAction({
        id: 'better-score-bad-priority',
        group: {
          priority: 99,
        },
        scoreOverride: 0.60 + gap,
      })
      const worseScoreGoodPriority = makeAction({
        id: 'worse-score-good-priority',
        group: {
          priority: 1,
        },
        scoreOverride: 0.60,
      })

      const grouped = await applicableActions([
        betterScoreBadPriority,
        worseScoreGoodPriority,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(grouped)).toEqual([
        'worse-score-good-priority',
        'better-score-bad-priority',
      ])

      const disabled = await applicableActions(
        [
          betterScoreBadPriority,
          worseScoreGoodPriority,
        ],
        makeCtx({
          searchInput: 'x',
        }),
        undefined,
        undefined,
        true,
      )

      expect(ids(disabled)).toEqual([
        'better-score-bad-priority',
        'worse-score-good-priority',
      ])
    })

    it('still uses group priority to order the root menu (no search input) when disabled', async () => {
      // Regression test: with no query, every action scores 1 (same tier), so
      // group priority is the only ordering signal available. Bypassing it
      // unconditionally collapsed the comparator to a no-op and left the root
      // menu in arbitrary order.
      const result = await applicableActions(
        makeJohnActions(),
        makeCtx({
          searchInput: '',
        }),
        undefined,
        undefined,
        true,
      )

      expect(ids(result)).toEqual([
        'john-doe-user',
        'johns-company',
      ])
    })
  })

  describe('selected actions first', () => {
    it('sorts a selected action above an unselected one of equal score by default', async () => {
      const unselected = makeAction({
        id: 'a',
        scoreOverride: 1,
        selected: false,
      })
      const selected = makeAction({
        id: 'b',
        scoreOverride: 1,
        selected: true,
      })

      const result = await applicableActions([
        unselected,
        selected,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'b',
        'a',
      ])
    })

    it('falls back to group priority when the parent disables showSelectedSubActionsFirst', async () => {
      const parent = makeAction({
        id: 'parent',
        showSelectedSubActionsFirst: false,
      })
      const betterGroup = makeAction({
        id: 'a',
        group: {
          priority: 1,
        },
        parentAction: parent,
        scoreOverride: 1,
        selected: false,
      })
      const selectedButWorseGroup = makeAction({
        id: 'b',
        group: {
          priority: 5,
        },
        parentAction: parent,
        scoreOverride: 1,
        selected: true,
      })

      const result = await applicableActions([
        selectedButWorseGroup,
        betterGroup,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'a',
        'b',
      ])
    })

    it('uses the parentAction passed into applicableActions when an action has no parentAction of its own', async () => {
      const parent = makeAction({
        id: 'parent',
        showSelectedSubActionsFirst: false,
      })
      const betterGroup = makeAction({
        id: 'a',
        group: {
          priority: 1,
        },
        scoreOverride: 1,
        selected: false,
      })
      const selectedButWorseGroup = makeAction({
        id: 'b',
        group: {
          priority: 5,
        },
        scoreOverride: 1,
        selected: true,
      })

      const result = await applicableActions([
        selectedButWorseGroup,
        betterGroup,
      ], makeCtx({
        searchInput: 'x',
      }), undefined, parent)

      expect(ids(result)).toEqual([
        'a',
        'b',
      ])
    })
  })

  describe('fuzzy score ordering', () => {
    it('ranks an exact match above a prefix match above a contains match', async () => {
      const exact = makeAction({
        id: 'exact',
        name: 'Set',
      })
      const prefix = makeAction({
        id: 'prefix',
        name: 'Settings Page',
      })
      const contains = makeAction({
        id: 'contains',
        name: 'User Settings',
      })

      const result = await applicableActions([
        contains,
        prefix,
        exact,
      ], makeCtx({
        searchInput: 'set',
      }))

      expect(ids(result)).toEqual([
        'exact',
        'prefix',
        'contains',
      ])
    })

    it('ranks an initials match above a plain subsequence match', async () => {
      // "New Document" -> initials "nd" match the query exactly (score 0.60).
      // "Open Door" -> "nd" only appears as a non-adjacent subsequence (lower score).
      const initialsMatch = makeAction({
        id: 'initials',
        name: 'New Document',
      })
      const subsequenceMatch = makeAction({
        id: 'subsequence',
        name: 'Open Door',
      })

      const result = await applicableActions([
        subsequenceMatch,
        initialsMatch,
      ], makeCtx({
        searchInput: 'nd',
      }))

      expect(ids(result)).toEqual([
        'initials',
        'subsequence',
      ])
    })

    it('excludes actions that score below the minimum applicability score', async () => {
      const unrelated = makeAction({
        name: 'Delete Project',
      })

      const result = await applicableActions([
        unrelated,
      ], makeCtx({
        searchInput: 'xyzxyz',
      }))

      expect(result).toEqual([])
    })

    it('matches against keywords in addition to the name', async () => {
      const action = makeAction({
        name: 'Billing',
        keywords: [
          'invoice',
        ],
      })

      const result = await applicableActions([
        action,
      ], makeCtx({
        searchInput: 'invoice',
      }))

      expect(result).toHaveLength(1)
    })
  })

  describe('keywordsExactMatch', () => {
    it('boosts an action to the top score when an exact keyword matches, overriding a weak fuzzy match', async () => {
      const exactKeyword = makeAction({
        id: 'exact-keyword',
        name: 'Frobnicate Widget',
        keywords: [
          'support ticket',
        ],
        keywordsExactMatch: [
          'support ticket',
        ],
      })
      const naturalMatch = makeAction({
        id: 'natural-match',
        name: 'Ticket Support Center',
      })

      const result = await applicableActions([
        naturalMatch,
        exactKeyword,
      ], makeCtx({
        searchInput: 'ticket',
      }))

      expect(ids(result)).toEqual([
        'exact-keyword',
        'natural-match',
      ])
    })
  })

  describe('scoreOverride', () => {
    it('replaces the computed score entirely', async () => {
      const wouldNormallyRankHigher = makeAction({
        id: 'normally-higher',
        name: 'Exact',
        scoreOverride: 0.3,
      })
      const boosted = makeAction({
        id: 'boosted',
        name: 'Unrelated',
        scoreOverride: 0.9,
      })

      const result = await applicableActions([
        wouldNormallyRankHigher,
        boosted,
      ], makeCtx({
        searchInput: 'exact',
      }))

      expect(ids(result)).toEqual([
        'boosted',
        'normally-higher',
      ])
    })

    it('is filtered out when the override is below the minimum applicability score, and kept when exactly at it', async () => {
      const belowThreshold = makeAction({
        id: 'below',
        scoreOverride: DEFAULT_MIN_APPLICABILITY_SCORE - 0.01,
      })
      const atThreshold = makeAction({
        id: 'at',
        scoreOverride: DEFAULT_MIN_APPLICABILITY_SCORE,
      })

      const result = await applicableActions([
        belowThreshold,
        atThreshold,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'at',
      ])
    })

    it('has no effect when the search input is empty', async () => {
      const action = makeAction({
        scoreOverride: 0,
      })

      const result = await applicableActions([
        action,
      ], makeCtx({
        searchInput: '',
      }))

      expect(result).toHaveLength(1)
    })
  })

  describe('sortPriority', () => {
    it('nudges ordering between otherwise tied actions; higher sortPriority sorts lower', async () => {
      const pushedDown = makeAction({
        id: 'pushed-down',
        scoreOverride: 1,
        sortPriority: 10,
      })
      const neutral = makeAction({
        id: 'neutral',
        scoreOverride: 1,
        sortPriority: 1,
      })

      const result = await applicableActions([
        pushedDown,
        neutral,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'neutral',
        'pushed-down',
      ])
    })
  })

  describe('group priority', () => {
    it('orders tied-score actions by ascending numeric group priority', async () => {
      const ungrouped = makeAction({
        id: 'ungrouped',
        scoreOverride: 1,
      })
      const lowPriorityNumber = makeAction({
        id: 'high-precedence',
        group: {
          priority: 1,
        },
        scoreOverride: 1,
      })
      const highPriorityNumber = makeAction({
        id: 'low-precedence',
        group: {
          priority: 5,
        },
        scoreOverride: 1,
      })

      const result = await applicableActions([
        ungrouped,
        highPriorityNumber,
        lowPriorityNumber,
      ], makeCtx({
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'high-precedence',
        'low-precedence',
        'ungrouped',
      ])
    })

    it('resolves a function-based group priority using the current context', async () => {
      const vip = makeAction({
        id: 'vip',
        group: {
          priority: (ctx) => (ctx.metadata.isVip ? 0 : 10),
        },
        scoreOverride: 1,
      })
      const regular = makeAction({
        id: 'regular',
        group: {
          priority: 3,
        },
        scoreOverride: 1,
      })

      const result = await applicableActions([
        regular,
        vip,
      ], makeCtx({
        metadata: {
          isVip: true,
        },
        searchInput: 'x',
      }))

      expect(ids(result)).toEqual([
        'vip',
        'regular',
      ])
    })

    it('produces the same order regardless of input order, even for a chain of near-tied scores', async () => {
      // Regression test: comparing scores pairwise against
      // SCORE_GROUP_PRIORITY_THRESHOLD (instead of bucketing scores into
      // tiers first) can create a non-transitive comparator — e.g. A beats B
      // and B beats C on group priority (each pair within the threshold), but
      // A vs C falls outside the threshold and score decides the other way.
      // That cycle makes Array.sort's result depend on the input array's
      // order rather than on the actions themselves.
      const low = makeAction({
        id: 'low',
        group: {
          priority: 1,
        },
        scoreOverride: 0.30,
      })
      const mid = makeAction({
        id: 'mid',
        group: {
          priority: 5,
        },
        scoreOverride: 0.34,
      })
      const high = makeAction({
        id: 'high',
        group: {
          priority: 10,
        },
        scoreOverride: 0.38,
      })

      const orderings = [
        [
          low,
          mid,
          high,
        ],
        [
          high,
          low,
          mid,
        ],
        [
          mid,
          high,
          low,
        ],
      ]

      const results = await Promise.all(orderings.map((input) => applicableActions(input, makeCtx({
        searchInput: 'x',
      })).then(ids)))

      // "high" has the best raw score, in a tier of its own, so it always wins.
      // "low" and "mid" are within SCORE_GROUP_PRIORITY_THRESHOLD of each
      // other, so group priority decides between them: "low" wins.
      for (const result of results) {
        expect(result).toEqual([
          'high',
          'low',
          'mid',
        ])
      }
    })
  })

  describe('parentAction score penalty', () => {
    it('can push a borderline sub-action match below the minimum applicability score', async () => {
      const query = 'cm'
      const name = 'Reference Permission'

      const standalone = makeAction({
        id: 'standalone',
        name,
      })

      const standaloneResult = await applicableActions([
        standalone,
      ], makeCtx({
        searchInput: query,
      }))

      expect(ids(standaloneResult)).toEqual([
        'standalone',
      ])

      const parent = makeAction({
        id: 'parent',
      })
      const liftedEquivalent = makeAction({
        id: 'lifted',
        name,
        parentAction: parent,
        // Exclude the parent breadcrumb from scoring so this only exercises
        // the flat PARENT_ACTION_SCORE_PENALTY, not a different match string.
        parentScoreInfluence: 'none',
      })

      const liftedResult = await applicableActions([
        liftedEquivalent,
      ], makeCtx({
        searchInput: query,
      }))

      expect(liftedResult).toEqual([])
    })
  })

  describe('with an empty search input', () => {
    it('sorts by selected-first, then by group priority, ignoring fuzzy score', async () => {
      // Every action scores 1 when the query is empty, so the score-based
      // tie-break never applies and group priority decides the order.
      const selected = makeAction({
        id: 'selected',
        name: 'Zzz',
        group: {
          priority: 5,
        },
        selected: true,
      })
      const highPriority = makeAction({
        id: 'high-priority',
        name: 'Aaa',
        group: {
          priority: 1,
        },
      })
      const lowPriority = makeAction({
        id: 'low-priority',
        name: 'Bbb',
        group: {
          priority: 2,
        },
      })

      const result = await applicableActions([
        lowPriority,
        highPriority,
        selected,
      ], makeCtx({
        searchInput: '',
      }))

      expect(ids(result)).toEqual([
        'selected',
        'high-priority',
        'low-priority',
      ])
    })
  })
})

describe('applicableActions > sub-action lifting', () => {
  beforeEach(() => {
    setIsAuthenticated(true)
  })

  it('does not search sub-actions when below the minimum search input length', async () => {
    const child = makeAction({
      id: 'child',
      name: 'Matches Well',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      name: 'Parent',
      skipFilterScoring: true,
      subActions: () => [
        child,
      ],
    })

    const shortInput = 'a'.repeat(DEFAULT_MIN_SEARCH_INPUT_LENGTH - 1)

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: shortInput,
    }))

    expect(ids(result)).toEqual([
      'parent',
    ])
  })

  it('lifts sync sub-actions once the search input reaches the minimum length', async () => {
    const child = makeAction({
      id: 'child',
      name: 'Child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      name: 'Parent',
      skipFilterScoring: true,
      subActions: () => [
        child,
      ],
    })

    const input = 'a'.repeat(DEFAULT_MIN_SEARCH_INPUT_LENGTH)

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: input,
    }))

    const lifted = result.find((a) => a.id === 'child')

    expect(lifted).toBeDefined()
    expect(lifted?.parentAction?.id).toBe('parent')
    expect(lifted?.rootAction?.id).toBe('parent')
    expect(lifted?.onlyVisibleThroughSearch).toBeTruthy()
  })

  it('respects a custom minLength from searchSubActionsConfig', async () => {
    const child = makeAction({
      id: 'child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      searchSubActionsConfig: {
        minLength: 5,
      },
      skipFilterScoring: true,
      subActions: () => [
        child,
      ],
    })

    const tooShort = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'abcd',
    }))

    expect(ids(tooShort)).toEqual([
      'parent',
    ])

    const longEnough = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'abcde',
    }))

    expect(ids(longEnough)).toContain('child')
  })

  it('caps lifted sync sub-actions to maxResults', async () => {
    const children = Array.from({
      length: 3,
    }, (_, i) => makeAction({
      id: `child-${i}`,
      skipFilterScoring: true,
    }))
    const parent = makeAction({
      id: 'parent',
      searchSubActionsConfig: {
        maxResults: 1,
      },
      skipFilterScoring: true,
      subActions: () => children,
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(ids(result)).toEqual([
      'parent',
      'child-0',
    ])
  })

  it('defaults maxResults to DEFAULT_MAX_SUB_ACTIONS', async () => {
    const children = Array.from({
      length: DEFAULT_MAX_SUB_ACTIONS + 5,
    }, (_, i) => makeAction({
      id: `child-${i}`,
      skipFilterScoring: true,
    }))
    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => children,
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(result).toHaveLength(1 + DEFAULT_MAX_SUB_ACTIONS)
  })

  it('lifts sub-actions returned as a Promise', async () => {
    const child = makeAction({
      id: 'child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => Promise.resolve([
        child,
      ]),
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(ids(result)).toContain('child')
  })

  it('lifts sub-actions returned as a Promise<SubActionsWithMeta>', async () => {
    const child = makeAction({
      id: 'child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => Promise.resolve({
        actions: [
          child,
        ],
        pagination: {
          nextOffset: null,
        },
      }),
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(ids(result)).toContain('child')
  })

  it('lifts sub-actions returned as a sync SubActionsWithMeta', async () => {
    const child = makeAction({
      id: 'child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => ({
        actions: [
          child,
        ],
        pagination: {
          nextOffset: null,
        },
      }),
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(ids(result)).toContain('child')
  })

  it('lifts sub-actions returned as an AsyncGenerator', async () => {
    async function* generate(): AsyncGenerator<Action> {
      yield makeAction({
        id: 'gen-1',
        skipFilterScoring: true,
      })
      yield makeAction({
        id: 'gen-2',
        skipFilterScoring: true,
      })
    }

    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => generate(),
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    expect(ids(result)).toEqual(expect.arrayContaining([
      'gen-1',
      'gen-2',
    ]))
  })

  it('inherits groupWhenLifted from the parent when the child has no group of its own', async () => {
    const withoutGroup = makeAction({
      id: 'no-group',
      skipFilterScoring: true,
    })
    const withOwnGroup = makeAction({
      id: 'own-group',
      group: {
        name: 'Own Group',
      },
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      group: {
        groupWhenLifted: {
          name: 'Inherited Group',
        },
      },
      skipFilterScoring: true,
      subActions: () => [
        withoutGroup,
        withOwnGroup,
      ],
    })

    const result = await applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }))

    const lifted1 = result.find((a) => a.id === 'no-group')
    const lifted2 = result.find((a) => a.id === 'own-group')

    expect(lifted1?.group?.name).toBe('Inherited Group')
    expect(lifted2?.group?.name).toBe('Own Group')
  })

  it('emits partial sync results via onUpdate before resolving with the merged async results', async () => {
    let resolveChild!: (value: Action[]) => void
    const pending = new Promise<Action[]>((resolve) => {
      resolveChild = resolve
    })

    const asyncChild = makeAction({
      id: 'async-child',
      skipFilterScoring: true,
    })
    const parent = makeAction({
      id: 'parent',
      skipFilterScoring: true,
      subActions: () => pending,
    })

    const updates: string[][] = []

    const finalPromise = applicableActions([
      parent,
    ], makeCtx({
      searchInput: 'xx',
    }), (partial) => {
      updates.push(ids(partial))
    })

    resolveChild([
      asyncChild,
    ])

    const final = await finalPromise

    expect(updates[0]).toEqual([
      'parent',
    ])
    expect(updates.at(-1)).toEqual(expect.arrayContaining([
      'parent',
      'async-child',
    ]))
    expect(ids(final)).toEqual(expect.arrayContaining([
      'parent',
      'async-child',
    ]))
  })
})
