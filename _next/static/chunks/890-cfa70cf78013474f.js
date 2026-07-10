"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[890],{

/***/ 393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ evaluateFormula)
/* harmony export */ });
/* harmony import */ var _lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6353);

const FIXED_ZODIAC_POSITION_ORDER = [
    "鼠",
    "牛",
    "虎",
    "兔",
    "龙",
    "蛇",
    "马",
    "羊",
    "猴",
    "鸡",
    "狗",
    "猪"
];
function normalizeFormulaText(formula) {
    return formula.replace(/([1-7])\uFE0F?\u20E3/g, "$1").replace(/[，、；;]/g, "+");
}
function fixedZodiacPosition(number, config) {
    const zodiac = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(number, config).zodiac;
    const index = FIXED_ZODIAC_POSITION_ORDER.indexOf(zodiac);
    if (index < 0) throw new Error(`未知生肖位置：${zodiac}`);
    return index + 1;
}
function tokenize(formula) {
    const tokens = [];
    let i = 0;
    while(i < formula.length){
        const char = formula[i];
        if (/\s/.test(char)) {
            i += 1;
            continue;
        }
        if (/[0-9.]/.test(char)) {
            let value = char;
            i += 1;
            while(i < formula.length && /[0-9.]/.test(formula[i])){
                value += formula[i++];
            }
            tokens.push({
                type: "number",
                value
            });
            continue;
        }
        if ("+-*/".includes(char)) {
            tokens.push({
                type: "operator",
                value: char
            });
            i += 1;
            continue;
        }
        if ("()（）".includes(char)) {
            tokens.push({
                type: "paren",
                value: char === "（" ? "(" : char === "）" ? ")" : char
            });
            i += 1;
            continue;
        }
        let value = char;
        i += 1;
        while(i < formula.length && !/\s/.test(formula[i]) && !/[+\-*/()（）]/.test(formula[i])){
            value += formula[i++];
        }
        tokens.push({
            type: "identifier",
            value
        });
    }
    return tokens;
}
function attrValue(name, number, config) {
    const attrs = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(number, config);
    const normalizedName = name.replace(/值$/, "");
    switch(normalizedName){
        case "头":
            return attrs.head;
        case "尾":
            return attrs.tail;
        case "合":
        case "合数":
            return attrs.sum;
        case "合尾":
        case "合数尾":
            return attrs.sumTail;
        case "段":
            return attrs.segment;
        case "波":
        case "波色":
        case "波色值":
            return attrs.colorValue;
        case "单双":
        case "奇偶":
            return attrs.parity === "单" ? 1 : 2;
        case "头单":
        case "头数单":
            return attrs.headParityType === "头单" ? 1 : 0;
        case "头双":
        case "头数双":
            return attrs.headParityType === "头双" ? 1 : 0;
        case "大小":
            return attrs.size === "大" ? 1 : 0;
        case "行":
        case "五行":
        case "五行值":
            return attrs.elementValue;
        case "码":
        case "号码":
            return attrs.number;
        case "位":
        case "位置":
        case "生肖位":
            return fixedZodiacPosition(number, config);
        default:
            throw new Error(`未知属性函数：${name}`);
    }
}
function positionIndex(value) {
    const map = {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7
    };
    return map[value];
}
function specialVariable(name, draw) {
    const attrs = draw.specialAttributes;
    const issueDigits = draw.issue.replace(/\D/g, "");
    const issuePeriodNumber = Number(issueDigits.slice(-3) || issueDigits || "0");
    const map = {
        特码: draw.special,
        特号: draw.special,
        特: draw.special,
        杀码: draw.special,
        特码头: attrs.head,
        特码尾: attrs.tail,
        特码合: attrs.sum,
        特码合尾: attrs.sumTail,
        特码段: attrs.segment,
        特码波: attrs.colorValue,
        特码波色: attrs.colorValue,
        特码波色值: attrs.colorValue,
        特码单双: attrs.parity === "单" ? 1 : 2,
        特码奇偶: attrs.parity === "单" ? 1 : 2,
        特码大小: attrs.size === "大" ? 1 : 0,
        特码行: attrs.elementValue,
        特码五行: attrs.elementValue,
        特码五行值: attrs.elementValue,
        总数: draw.total,
        总数尾: draw.totalTail,
        总数合: draw.totalSum,
        期数: issuePeriodNumber,
        期数尾: draw.issueTail,
        期号尾: draw.issueTail,
        期尾: draw.issueTail,
        期合: draw.issueSum,
        期合尾: draw.issueSumTail
    };
    return map[name];
}
function resolveIdentifier(name, draw, orderMode, config) {
    const direct = specialVariable(name, draw);
    if (direct !== undefined) return direct;
    const order = orderMode === "D" ? draw.dOrder : draw.lOrder;
    const lMatch = name.match(/^L([1-7])$/i);
    if (lMatch) return draw.lOrder[Number(lMatch[1]) - 1];
    const dMatch = name.match(/^D([1-7])$/i);
    if (dMatch) return draw.dOrder[Number(dMatch[1]) - 1];
    const prefixedCodeMatch = name.match(/^(平|落)码([1-7一二三四五六七])(.+)?$/);
    if (prefixedCodeMatch) {
        const index = positionIndex(prefixedCodeMatch[2]);
        if (!index) throw new Error(`未知位置：${name}`);
        const baseNumber = prefixedCodeMatch[1] === "落" ? draw.lOrder[index - 1] : order[index - 1];
        const suffix = prefixedCodeMatch[3];
        return suffix ? attrValue(suffix, baseNumber, config) : baseNumber;
    }
    const positionMatch = name.match(/^(平|落)([1-7一二三四五六七])$/);
    if (positionMatch) {
        const index = positionIndex(positionMatch[2]);
        if (!index) throw new Error(`未知位置：${name}`);
        if (positionMatch[1] === "落") return draw.lOrder[index - 1];
        return order[index - 1];
    }
    const positionAttrMatch = name.match(/^(平|落)([1-7一二三四五六七])(.+)$/);
    if (positionAttrMatch) {
        const index = positionIndex(positionAttrMatch[2]);
        if (!index) throw new Error(`未知位置：${name}`);
        const baseNumber = positionAttrMatch[1] === "落" ? draw.lOrder[index - 1] : order[index - 1];
        return attrValue(positionAttrMatch[3], baseNumber, config);
    }
    const specialAttrMatch = name.match(/^特(?:码)?(.+)$/);
    if (specialAttrMatch) {
        return attrValue(specialAttrMatch[1], draw.special, config);
    }
    throw new Error(`未知变量：${name}`);
}
function evaluateFormula(formula, draw, config, orderMode) {
    const expression = normalizeFormulaText(formula);
    const tokens = tokenize(expression);
    let index = 0;
    const variables = {};
    const trace = [];
    function peek() {
        return tokens[index];
    }
    function consume() {
        const token = tokens[index];
        index += 1;
        if (!token) throw new Error("公式意外结束");
        return token;
    }
    function parsePrimary() {
        const token = consume();
        if (token.type === "number") return Number(token.value);
        if (token.type === "paren" && token.value === "(") {
            const value = parseExpression();
            const close = consume();
            if (close.value !== ")") throw new Error("括号未闭合");
            return value;
        }
        if (token.type === "operator" && token.value === "-") {
            return -parsePrimary();
        }
        if (token.type === "identifier") {
            if (peek()?.type === "paren" && peek()?.value === "(") {
                consume();
                const startIndex = index;
                const argValue = parseExpression();
                const close = consume();
                if (close.value !== ")") throw new Error("属性函数括号未闭合");
                const argText = tokens.slice(startIndex, index - 1).map((item)=>item.value).join("");
                const key = `${token.value}(${argText})`;
                const value = attrValue(token.value, argValue, config);
                variables[key] = value;
                trace.push(`${key} = ${value}`);
                return value;
            }
            const value = resolveIdentifier(token.value, draw, orderMode, config);
            variables[token.value] = value;
            trace.push(`${token.value} = ${value}`);
            return value;
        }
        throw new Error(`公式无法解析：${token.value}`);
    }
    function parseTerm() {
        let value = parsePrimary();
        while(peek()?.type === "operator" && "*/".includes(peek().value)){
            const operator = consume().value;
            const right = parsePrimary();
            value = operator === "*" ? value * right : value / right;
        }
        return value;
    }
    function parseExpression() {
        let value = parseTerm();
        while(peek()?.type === "operator" && "+-".includes(peek().value)){
            const operator = consume().value;
            const right = parseTerm();
            value = operator === "+" ? value + right : value - right;
        }
        return value;
    }
    const value = parseExpression();
    if (index < tokens.length) {
        throw new Error(`公式存在未消费片段：${tokens.slice(index).map((item)=>item.value).join("")}`);
    }
    return {
        value,
        expression,
        variables,
        trace
    };
}


/***/ }),

/***/ 2832:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rt: () => (/* binding */ runBacktest)
/* harmony export */ });
/* unused harmony exports clearBacktestCache, getBacktestCacheSize */
/* harmony import */ var _lib_engine_attributes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6353);
/* harmony import */ var _lib_formula_engine_formula_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(680);



const backtestCache = new Map();
function cloneBacktest(result) {
    return {
        generatedAt: result.generatedAt,
        ruleResults: result.ruleResults.map((ruleResult)=>({
                ...ruleResult,
                rule: {
                    ...ruleResult.rule,
                    positionPattern: [
                        ...ruleResult.rule.positionPattern
                    ],
                    tags: [
                        ...ruleResult.rule.tags
                    ],
                    examples: [
                        ...ruleResult.rule.examples
                    ]
                },
                last10: [
                    ...ruleResult.last10
                ],
                failedIssues: [
                    ...ruleResult.failedIssues
                ],
                details: ruleResult.details.map((detail)=>({
                        ...detail,
                        currentNumbers: [
                            ...detail.currentNumbers
                        ],
                        lOrder: [
                            ...detail.lOrder
                        ],
                        dOrder: [
                            ...detail.dOrder
                        ],
                        variables: {
                            ...detail.variables
                        },
                        process: [
                            ...detail.process
                        ],
                        normalizerSteps: [
                            ...detail.normalizerSteps
                        ],
                        finalResult: Array.isArray(detail.finalResult) ? [
                            ...detail.finalResult
                        ] : detail.finalResult,
                        mappedResult: [
                            ...detail.mappedResult
                        ],
                        secondaryMappedResult: detail.secondaryMappedResult ? [
                            ...detail.secondaryMappedResult
                        ] : undefined,
                        nextNumbers: detail.nextNumbers ? [
                            ...detail.nextNumbers
                        ] : undefined,
                        nextSpecialAttributes: detail.nextSpecialAttributes ? {
                            ...detail.nextSpecialAttributes
                        } : undefined,
                        futureChecks: detail.futureChecks.map((check)=>({
                                ...check,
                                specialAttributes: {
                                    ...check.specialAttributes
                                }
                            }))
                    }))
            }))
    };
}
function backtestCacheKey(input) {
    return JSON.stringify({
        fromIssue: input.fromIssue ?? "",
        toIssue: input.toIssue ?? "",
        draws: input.draws.map((draw)=>[
                draw.issue,
                draw.n1,
                draw.n2,
                draw.n3,
                draw.n4,
                draw.n5,
                draw.n6,
                draw.special
            ]),
        rules: input.rules.map((rule)=>[
                rule.id,
                rule.updatedAt,
                rule.enabled,
                rule.category,
                rule.orderMode,
                rule.formula,
                rule.normalizer,
                rule.target,
                rule.positionPattern,
                rule.anchorIssue ?? "",
                rule.anchorPatternIndex ?? "",
                rule.periodSpan,
                rule.verifyOffset ?? ""
            ]),
        config: input.config
    });
}
function clearBacktestCache() {
    backtestCache.clear();
}
function getBacktestCacheSize() {
    return backtestCache.size;
}
function streak(values) {
    let current = 0;
    let max = 0;
    let running = 0;
    for (const value of values){
        if (value) {
            running += 1;
            max = Math.max(max, running);
        } else {
            running = 0;
        }
    }
    for(let i = values.length - 1; i >= 0; i -= 1){
        if (!values[i]) break;
        current += 1;
    }
    return {
        current,
        max
    };
}
function buildRuleResult(rule, normalizedDraws, config) {
    const details = [];
    const span = Math.max(rule.periodSpan || 1, rule.verifyOffset || 1, rule.category === "eight_zodiac_two_period" ? 2 : 1);
    try {
        for(let index = 0; index < normalizedDraws.length - span; index += 1){
            details.push((0,_lib_formula_engine_formula_engine__WEBPACK_IMPORTED_MODULE_0__/* .calculateRuleDetail */ .sD)({
                rule,
                current: normalizedDraws[index],
                futureDraws: normalizedDraws.slice(index + 1, index + span + 1),
                config,
                periodIndex: index
            }));
        }
    } catch (error) {
        return {
            rule,
            total: 0,
            success: 0,
            failed: 0,
            successRate: 0,
            currentStreak: 0,
            maxStreak: 0,
            last10: [],
            failedIssues: [],
            details: [],
            error: error instanceof Error ? error.message : String(error)
        };
    }
    const values = details.map((detail)=>detail.success);
    const successCount = values.filter(Boolean).length;
    const streaks = streak(values);
    return {
        rule,
        total: details.length,
        success: successCount,
        failed: details.length - successCount,
        successRate: details.length ? Number((successCount / details.length * 100).toFixed(2)) : 0,
        currentStreak: streaks.current,
        maxStreak: streaks.max,
        last10: values.slice(-10),
        failedIssues: details.filter((detail)=>!detail.success).map((detail)=>detail.currentIssue),
        details
    };
}
function runBacktest(input) {
    const key = backtestCacheKey(input);
    const cached = backtestCache.get(key);
    if (cached) return cloneBacktest(cached);
    const normalizedDraws = input.draws.map((draw)=>(0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_1__/* .normalizeDraw */ .YC)(draw, input.config)).filter((draw)=>(!input.fromIssue || draw.issue >= input.fromIssue) && (!input.toIssue || draw.issue <= input.toIssue));
    const result = {
        generatedAt: new Date().toISOString(),
        ruleResults: input.rules.filter((rule)=>rule.enabled).map((rule)=>buildRuleResult(rule, normalizedDraws, input.config))
    };
    backtestCache.set(key, cloneBacktest(result));
    return cloneBacktest(result);
}


/***/ }),

/***/ 6353:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KP: () => (/* binding */ normalizeTail),
/* harmony export */   Qd: () => (/* binding */ normalizeElement),
/* harmony export */   WF: () => (/* binding */ normalizeHead),
/* harmony export */   XI: () => (/* binding */ normalizeSum),
/* harmony export */   YC: () => (/* binding */ normalizeDraw),
/* harmony export */   hJ: () => (/* binding */ getNumberAttributes),
/* harmony export */   jH: () => (/* binding */ normalizeSegment),
/* harmony export */   t4: () => (/* binding */ normalizeZodiacNumber)
/* harmony export */ });
/* unused harmony export digitSum */
function digitSum(value) {
    return Math.abs(value).toString().split("").reduce((sum, digit)=>sum + Number(digit), 0);
}
function lookupNumber(table, value) {
    const match = Object.entries(table).find(([, numbers])=>numbers.includes(value));
    if (!match) {
        throw new Error(`号码 ${value} 不在配置表中`);
    }
    return match[0];
}
function getNumberAttributes(number, config) {
    if (!Number.isInteger(number) || number < 1 || number > 49) {
        throw new Error(`号码必须在 1-49 之间，当前为 ${number}`);
    }
    const head = Math.floor(number / 10);
    const tail = number % 10;
    const sum = digitSum(number);
    const sumTail = sum % 10;
    const segment = config.segmentRanges.find((range)=>number >= range.from && number <= range.to)?.label;
    const zodiac = lookupNumber(config.zodiacTable, number);
    const color = lookupNumber(config.colorTable, number);
    const element = lookupNumber(config.elementTable, number);
    const headParityType = number % 2 === 0 ? "头双" : "头单";
    if (!segment) {
        throw new Error(`号码 ${number} 未匹配段位`);
    }
    return {
        number,
        head,
        tail,
        sum,
        sumTail,
        segment,
        zodiac,
        color,
        colorValue: config.colorValues[color],
        element,
        elementValue: config.elementValues[element],
        parity: number % 2 === 0 ? "双" : "单",
        size: number >= 25 ? "大" : "小",
        headParity: `${head}${headParityType}`,
        headParityType
    };
}
function rawBallMap(draw) {
    const balls = draw.rawAttributes?.balls;
    if (!Array.isArray(balls)) return new Map();
    return new Map(balls.filter((ball)=>Boolean(ball) && typeof ball === "object").map((ball)=>[
            Number(ball.number),
            ball
        ]));
}
function applyRawAttributes(attributes, raw, config) {
    if (!raw) return attributes;
    const zodiac = typeof raw.zodiac === "string" && raw.zodiac ? raw.zodiac : attributes.zodiac;
    const color = typeof raw.color === "string" && raw.color ? raw.color : attributes.color;
    const element = typeof raw.element === "string" && raw.element ? raw.element : attributes.element;
    return {
        ...attributes,
        zodiac,
        color,
        colorValue: config.colorValues[color] ?? attributes.colorValue,
        element,
        elementValue: config.elementValues[element] ?? attributes.elementValue
    };
}
function normalizeDraw(draw, config) {
    const lOrder = [
        draw.n1,
        draw.n2,
        draw.n3,
        draw.n4,
        draw.n5,
        draw.n6,
        draw.special
    ];
    const dOrder = [
        [
            draw.n1,
            draw.n2,
            draw.n3,
            draw.n4,
            draw.n5,
            draw.n6
        ].sort((a, b)=>a - b),
        [
            draw.special
        ]
    ].flat();
    const rawAttributesByNumber = rawBallMap(draw);
    const attributes = lOrder.map((number)=>applyRawAttributes(getNumberAttributes(number, config), rawAttributesByNumber.get(number), config));
    const total = lOrder.reduce((sum, number)=>sum + number, 0);
    const issueDigits = draw.issue.replace(/\D/g, "");
    const issuePeriodNumber = Number(issueDigits.slice(-3) || issueDigits || "0");
    const issueSum = digitSum(issuePeriodNumber);
    return {
        ...draw,
        lOrder,
        dOrder,
        attributes,
        specialAttributes: attributes[6],
        total,
        totalTail: total % 10,
        totalSum: digitSum(total),
        issueTail: issuePeriodNumber % 10,
        issueSum,
        issueSumTail: issueSum % 10
    };
}
function reduceBy(raw, step, maxExclusive) {
    const steps = [
        raw
    ];
    let value = raw;
    while(value >= maxExclusive){
        value -= step;
        steps.push(value);
    }
    return {
        value,
        steps
    };
}
function normalizeZodiacNumber(raw) {
    const steps = [
        raw
    ];
    let value = raw;
    while(value > 49){
        value -= 48;
        steps.push(value);
    }
    return {
        value,
        steps
    };
}
function normalizeSum(raw) {
    return reduceBy(raw, 13, 14);
}
function normalizeTail(raw) {
    return {
        value: (raw % 10 + 10) % 10,
        steps: [
            raw,
            (raw % 10 + 10) % 10
        ]
    };
}
function normalizeHead(raw) {
    return reduceBy(raw, 5, 5);
}
function normalizeElement(raw) {
    const steps = [
        raw
    ];
    let value = raw;
    while(value > 5){
        value -= 5;
        steps.push(value);
    }
    while(value < 1){
        value += 5;
        steps.push(value);
    }
    return {
        value,
        steps
    };
}
function normalizeSegment(raw) {
    return reduceBy(raw, 7, 8);
}


/***/ })

}]);