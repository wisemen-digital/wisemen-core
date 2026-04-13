export class StyleBuilder {
  private readonly classes: string[] = []

  private with(classes: string): this {
    this.classes.push(classes)

    return this
  }

  public build(): string {
    return this.classes.join(' ')
  }

  public withBackgroundColor(backgroundColor: string): this {
    this.with(backgroundColor)

    return this
  }

  public withBase(classes: string): this {
    this.classes.push(classes)

    return this
  }

  public withBorder(border: string): this {
    this.with(border)

    return this
  }

  public withBorderRadius(borderRadius: string): this {
    this.with(borderRadius)

    return this
  }

  public withClasses(classes: string): this {
    this.with(classes)

    return this
  }

  public withColor(color: string): this {
    this.with(color)

    return this
  }

  public withCursor(cursor: string): this {
    this.with(cursor)

    return this
  }

  public withFlex(flex: string): this {
    this.with(flex)

    return this
  }

  public withFontColor(fontColor: string): this {
    this.with(fontColor)

    return this
  }

  public withFontSize(fontSize: string): this {
    this.with(fontSize)

    return this
  }

  public withFontWeight(fontWeight: string): this {
    this.with(fontWeight)

    return this
  }

  public withGap(gap: string): this {
    this.with(gap)

    return this
  }

  public withGrid(grid: string): this {
    this.with(grid)

    return this
  }

  public withHeight(height: string): this {
    this.with(height)

    return this
  }

  public withLeading(leading: string): this {
    this.with(leading)

    return this
  }

  public withMargin(margin: string): this {
    this.with(margin)

    return this
  }

  public withOutline(outline: string): this {
    this.with(outline)

    return this
  }

  public withPadding(padding: string): this {
    this.with(padding)

    return this
  }

  public withPlaceholderColor(placeholderColor: string): this {
    this.with(placeholderColor)

    return this
  }

  /**
   * @deprecated Use `withOutline` instead.
   */
  public withRing(ring: string): this {
    this.with(ring)

    return this
  }

  public withShadow(shadow: string): this {
    this.with(shadow)

    return this
  }

  public withSize(size: string): this {
    this.with(size)

    return this
  }

  public withSpacing(spacing: string): this {
    this.with(spacing)

    return this
  }

  public withTransition(transition: string): this {
    this.with(transition)

    return this
  }

  public withTranslate(translate: string): this {
    this.with(translate)

    return this
  }

  public withZIndex(zIndex: string): this {
    this.with(zIndex)

    return this
  }
}
