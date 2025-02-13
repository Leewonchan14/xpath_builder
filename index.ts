export class XPathBuilder {
  protected expression: string = "";

  // 정적 팩토리 메서드로 시작
  public static create() {
    return new XPathBuilder();
  }

  /**
   * 특정 자식 요소 선택 (예: /div)
   */
  public childElement(...names: string[]) {
    this.expression += "/" + names.join("/");
    return this;
  }

  /**
   * 문서 내 어느 위치에서든 특정 자식 요소 선택 (예: //span)
   */
  public anyDepthElement(name: string) {
    this.expression += "//" + name;
    return this;
  }

  /**
   * 문서 내 모든 요소 선택 (예: //*)
   */
  public anyElement() {
    this.expression += "//*";
    return this;
  }

  /**
   * predicate 조건을 추가합니다.
   * 사용 예: .should(builder => builder.attributeEquals("class", "active"))
   */
  public should(builder: (conditionBuilder: ConditionBuilder) => string) {
    this.expression += `[${builder(new ConditionBuilder())}]`;
    return this;
  }

  /**
   * 요소에 특정 속성이 존재함을 나타내는 조건
   * 예: attributeExists("id") → @id
   */
  public attributeExists(attr: string) {
    this.expression += `@${attr}`;
    return this;
  }

  /**
   * 요소의 속성이 특정 값과 일치하는 조건
   * 예: attributeEquals("class", "active") → @class='active'
   */
  public attributeEquals(attr: string, value: string) {
    this.expression += `@${attr}='${value}'`;
    return this;
  }

  /**
   * 요소의 텍스트 내용이 특정 값과 일치하는 조건
   * 예: textEquals("Hello") → text()='Hello'
   */
  public textEquals(value: string) {
    this.expression += `text()='${value}'`;
    return this;
  }

  /**
   * 요소의 텍스트에 특정 문자열이 포함되는 조건
   * 예: textContains("world") → contains(text(), 'world')
   */
  public textContains(value: string) {
    this.expression += `contains(text(), '${value}')`;
    return this;
  }

  /**
   * 요소의 특정 속성 값에 특정 문자열이 포함되는 조건
   * 예: attributeContains("class", "active") → contains(@class, 'active')
   */
  public attributeContains(attr: string, value: string) {
    this.expression += `contains(@${attr}, '${value}')`;
    return this;
  }

  /**
   * 완성된 XPath 식 반환
   */
  public build(): string {
    console.log("this.expression: ", this.expression);
    return this.expression;
  }
}

export class ConditionBuilder extends XPathBuilder {
  // 부모의 expression 프로퍼티를 그대로 사용하거나, 필요시 별도로 관리할 수 있음.
  // 여기서는 부모의 expression을 재사용합니다.
  // public expression: string = ""; // 제거하거나 재정의 시 주의

  public static create(): ConditionBuilder {
    return new ConditionBuilder();
  }

  /**
   * 현재 노드(점)를 나타내는 조건 추가
   */
  public have(): ConditionBuilder {
    this.expression += ".";
    return this;
  }

  /**
   * AND 조건 추가
   */
  public and(): ConditionBuilder {
    this.expression += " and ";
    return this;
  }

  /**
   * OR 조건 추가
   */
  public or(): ConditionBuilder {
    this.expression += " or ";
    return this;
  }

  /**
   * 소괄호로 묶인 서브 조건 추가
   */
  public bracket(
    subConditionBuilder: (builder: ConditionBuilder) => string
  ): ConditionBuilder {
    this.expression += `(${subConditionBuilder(new ConditionBuilder())})`;
    return this;
  }
}
