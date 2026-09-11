import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  clampToBounds,
  pointerToColumnIndex,
  pointerToMinutes,
  resolveEditability,
  snapMinutes,
} from '@/ui/calendar-week-view/utils/calendarDragMath.util'

const ALL_ON = {
  drag: true,
  resize: true,
  selectSlot: true,
}

const ALL_OFF = {
  drag: false,
  resize: false,
  selectSlot: false,
}

describe('pointerToMinutes', () => {
  const rect = {
    height: 960,
    top: 100,
  }

  it('maps the top of the grid to the start hour', () => {
    expect(pointerToMinutes({
      clientY: 100,
      endHour: 24,
      rect,
      startHour: 0,
    })).toBe(0)
  })

  it('maps the bottom of the grid to the end hour', () => {
    expect(pointerToMinutes({
      clientY: 1060,
      endHour: 24,
      rect,
      startHour: 0,
    })).toBe(1440)
  })

  it('offsets by the start hour on a partial-day grid', () => {
    expect(pointerToMinutes({
      clientY: 100,
      endHour: 18,
      rect,
      startHour: 8,
    })).toBe(480)
  })

  it('does not divide by zero on an unmeasured grid', () => {
    expect(pointerToMinutes({
      clientY: 500,
      endHour: 24,
      rect: {
        height: 0,
        top: 0,
      },
      startHour: 8,
    })).toBe(480)
  })
})

describe('pointerToColumnIndex', () => {
  const rect = {
    left: 100,
    width: 700,
  }

  it('resolves the column under the pointer', () => {
    expect(pointerToColumnIndex({
      clientX: 350,
      columnCount: 7,
      rect,
    })).toBe(2)
  })

  it('clamps past either edge instead of going out of range', () => {
    expect(pointerToColumnIndex({
      clientX: -500,
      columnCount: 7,
      rect,
    })).toBe(0)

    expect(pointerToColumnIndex({
      clientX: 5000,
      columnCount: 7,
      rect,
    })).toBe(6)
  })
})

describe('snapMinutes', () => {
  it('snaps to the absolute grid, not to the drag delta', () => {
    expect(snapMinutes(547, 15)).toBe(540)
    expect(snapMinutes(553, 15)).toBe(555)
  })

  it('leaves minutes untouched when snapping is disabled', () => {
    expect(snapMinutes(547, 0)).toBe(547)
  })
})

describe('clampToBounds', () => {
  const bounds = {
    boundsEndMin: 1440,
    boundsStartMin: 0,
  }

  it('leaves a block that already fits alone', () => {
    expect(clampToBounds({
      ...bounds,
      endMin: 600,
      startMin: 540,
    })).toEqual({
      endMin: 600,
      startMin: 540,
    })
  })

  it('slides a block back inside without changing its duration', () => {
    expect(clampToBounds({
      ...bounds,
      endMin: 1500,
      startMin: 1410,
    })).toEqual({
      endMin: 1440,
      startMin: 1350,
    })
  })

  it('respects a partial-day grid', () => {
    expect(clampToBounds({
      boundsEndMin: 1080,
      boundsStartMin: 480,
      endMin: 480,
      startMin: 420,
    })).toEqual({
      endMin: 540,
      startMin: 480,
    })
  })

  it('pins a block longer than the grid to the top', () => {
    expect(clampToBounds({
      boundsEndMin: 1080,
      boundsStartMin: 480,
      endMin: 1200,
      startMin: 300,
    })).toEqual({
      endMin: 1380,
      startMin: 480,
    })
  })
})

describe('resolveEditability', () => {
  it('follows the global interactions by default', () => {
    expect(resolveEditability({}, ALL_ON)).toEqual({
      isDraggable: true,
      isResizable: true,
    })

    expect(resolveEditability({}, ALL_OFF)).toEqual({
      isDraggable: false,
      isResizable: false,
    })
  })

  it('lets readOnly win over everything, including per-event opt-ins', () => {
    expect(resolveEditability({
      draggable: true,
      readOnly: true,
      resizable: true,
    }, ALL_ON)).toEqual({
      isDraggable: false,
      isResizable: false,
    })
  })

  it('lets a per-event flag widen a disabled global', () => {
    expect(resolveEditability({
      draggable: true,
    }, ALL_OFF)).toEqual({
      isDraggable: true,
      isResizable: false,
    })
  })

  it('lets a per-event flag narrow an enabled global', () => {
    expect(resolveEditability({
      resizable: false,
    }, ALL_ON)).toEqual({
      isDraggable: true,
      isResizable: false,
    })
  })
})
