/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ 680:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sD: () => (/* binding */ calculateRuleDetail)
/* harmony export */ });
/* unused harmony exports clearFormulaEngineCache, getFormulaEngineCacheSize, calculateRule, checkRuleSuccess, targetLabel */
/* harmony import */ var _lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6353);
/* harmony import */ var _lib_formula_evaluate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(393);


const calculationCache = new Map();
function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.entries(value).sort(([a], [b])=>a.localeCompare(b)).map(([key, item])=>`${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
    }
    return JSON.stringify(value);
}
function cloneCalculation(calculation) {
    const finalResult = Array.isArray(calculation.finalResult) ? typeof calculation.finalResult[0] === "number" ? [
        ...calculation.finalResult
    ] : [
        ...calculation.finalResult
    ] : calculation.finalResult;
    return {
        ...calculation,
        normalizerSteps: [
            ...calculation.normalizerSteps
        ],
        finalResult,
        mappedResult: [
            ...calculation.mappedResult
        ],
        secondaryMappedResult: calculation.secondaryMappedResult ? [
            ...calculation.secondaryMappedResult
        ] : undefined,
        process: [
            ...calculation.process
        ],
        variables: {
            ...calculation.variables
        },
        trace: [
            ...calculation.trace
        ]
    };
}
function ruleCacheSignature(rule) {
    return {
        id: rule.id,
        updatedAt: rule.updatedAt,
        category: rule.category,
        orderMode: rule.orderMode,
        formula: rule.formula,
        normalizer: rule.normalizer,
        target: rule.target,
        positionPattern: rule.positionPattern,
        anchorIssue: rule.anchorIssue,
        anchorPatternIndex: rule.anchorPatternIndex,
        periodSpan: rule.periodSpan,
        verifyOffset: rule.verifyOffset
    };
}
function drawCacheSignature(draw) {
    return {
        issue: draw.issue,
        lOrder: draw.lOrder,
        dOrder: draw.dOrder,
        special: draw.special,
        total: draw.total,
        issueSum: draw.issueSum
    };
}
function configCacheSignature(config) {
    return {
        zodiacTable: config.zodiacTable,
        zodiacOrder: config.zodiacOrder,
        zodiacClash: config.zodiacClash,
        colorTable: config.colorTable,
        colorValues: config.colorValues,
        elementTable: config.elementTable,
        elementValues: config.elementValues,
        segmentRanges: config.segmentRanges,
        sevenTailOffsets: config.sevenTailOffsets
    };
}
function cacheKey(rule, current, config, context) {
    return stableStringify({
        rule: ruleCacheSignature(rule),
        draw: drawCacheSignature(current),
        config: configCacheSignature(config),
        context: {
            periodIndex: context.periodIndex ?? null
        }
    });
}
function clearFormulaEngineCache() {
    calculationCache.clear();
}
function getFormulaEngineCacheSize() {
    return calculationCache.size;
}
function reductionProcess(steps, stepLabel) {
    if (steps.length <= 1) return [
        `取值 ${steps[0]}`
    ];
    return steps.slice(0, -1).map((value, index)=>`${value} - ${stepLabel} = ${steps[index + 1]}`);
}
function unique(items) {
    return [
        ...new Set(items)
    ];
}
function zodiacAtOffset(zodiac, offset, config) {
    const index = config.zodiacOrder.indexOf(zodiac);
    if (index < 0) throw new Error(`未知生肖：${zodiac}`);
    return config.zodiacOrder[(index + offset + config.zodiacOrder.length) % config.zodiacOrder.length];
}
function calcEightZodiac(start, config) {
    const next2 = zodiacAtOffset(start, 2, config);
    const next4 = zodiacAtOffset(start, 4, config);
    return unique([
        start,
        zodiacAtOffset(start, 1, config),
        next2,
        config.zodiacClash[next2],
        zodiacAtOffset(start, 3, config),
        next4,
        config.zodiacClash[next4],
        zodiacAtOffset(start, 5, config)
    ]);
}
function calcNineZodiac(start, config) {
    const next2 = zodiacAtOffset(start, 2, config);
    const next4 = zodiacAtOffset(start, 4, config);
    return unique([
        start,
        config.zodiacClash[start],
        zodiacAtOffset(start, 1, config),
        next2,
        config.zodiacClash[next2],
        zodiacAtOffset(start, 3, config),
        next4,
        config.zodiacClash[next4],
        zodiacAtOffset(start, 5, config)
    ]);
}
function calcEightZodiacTwoPeriod(center, config) {
    return unique([
        zodiacAtOffset(center, -3, config),
        zodiacAtOffset(center, -2, config),
        zodiacAtOffset(center, -1, config),
        center,
        zodiacAtOffset(center, 1, config),
        zodiacAtOffset(center, 2, config),
        zodiacAtOffset(center, 3, config),
        config.zodiacClash[center]
    ]);
}
function calcKillThree(center, config) {
    const next = zodiacAtOffset(center, 1, config);
    return unique([
        center,
        next,
        config.zodiacClash[next]
    ]);
}
function closedTail(baseTail, offset) {
    return ((baseTail + offset) % 10 + 10) % 10;
}
function closedZodiacNumber(base, offset) {
    let value = Math.round(base) + offset;
    while(value < 1)value += 12;
    while(value > 49)value -= 12;
    return value;
}
function parseSignedOffsets(value) {
    const explicit = [
        ...value.matchAll(/[+-]?\d+/g)
    ].map((match)=>Number(match[0])).filter(Number.isFinite);
    return explicit;
}
function parseCompactZodiacOffsets(value) {
    const compact = value.replace(/[^\d]/g, "");
    if (compact === "1234567911") return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        9,
        11
    ];
    if (!compact) return [];
    const offsets = [];
    let index = 0;
    while(index < compact.length){
        const two = compact.slice(index, index + 2);
        const requiredPrevious = two === "10" ? 9 : two === "11" ? 10 : two === "12" ? 11 : undefined;
        if (requiredPrevious !== undefined && offsets.includes(requiredPrevious)) {
            offsets.push(Number(two));
            index += 2;
        } else {
            offsets.push(Number(compact[index]));
            index += 1;
        }
    }
    return offsets.filter(Number.isFinite);
}
function tailOffsetsForRule(rule, config) {
    const normalizer = rule.normalizer ?? "";
    const leftRight = normalizer.match(/left\s*=?\s*(\d+).*right\s*=?\s*(\d+)/i) ?? normalizer.match(/left(\d+).*right(\d+)/i);
    if (leftRight) {
        const left = Number(leftRight[1]);
        const right = Number(leftRight[2]);
        return Array.from({
            length: left + right + 1
        }, (_, index)=>index - left);
    }
    if (/tail_(?:window|offsets)\s*:/i.test(normalizer)) {
        const [, value = ""] = normalizer.split(/tail_(?:window|offsets)\s*:/i);
        const offsets = parseSignedOffsets(value);
        if (offsets.length) return offsets;
    }
    return config.sevenTailOffsets;
}
function zodiacOffsetsForRule(rule) {
    const normalizer = rule.normalizer ?? "";
    const match = normalizer.match(/zodiac_offsets\s*:?\s*([+\-\d,\s.]+)/i);
    if (!match) return [];
    const source = match[1].trim();
    if (/^[+]?\d+$/.test(source)) return parseCompactZodiacOffsets(source);
    return parseSignedOffsets(source);
}
function zodiacSetOffsetsForRule(rule) {
    const normalizer = rule.normalizer ?? "";
    const match = normalizer.match(/zodiac_set_offsets\s*:?\s*([+\-\d,\s.]+)/i);
    if (match) {
        const source = match[1].trim();
        if (/^[+]?\d+$/.test(source)) return parseCompactZodiacOffsets(source);
        return parseSignedOffsets(source);
    }
    return zodiacOffsetsForRule(rule);
}
function calcZodiacOffsetSet(baseNumber, offsets, config) {
    const base = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(Math.round(baseNumber)).value;
    const numbers = unique(offsets.map((offset)=>closedZodiacNumber(base, offset)));
    const zodiacs = unique(numbers.map((number)=>(0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(number, config).zodiac));
    const lines = offsets.map((offset)=>{
        const wrapped = closedZodiacNumber(base, offset);
        const sign = offset >= 0 ? `+${offset}` : String(offset);
        return `${String(base).padStart(2, "0")} ${(0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(base, config).zodiac} ${sign} -> ${String(wrapped).padStart(2, "0")} ${(0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(wrapped, config).zodiac}`;
    });
    return {
        numbers,
        zodiacs,
        lines
    };
}
function shouldApplyPositionPattern(rule) {
    return rule.positionPattern.length > 0;
}
function issueSuffix(issue) {
    const digits = issue.replace(/\D/g, "");
    if (!digits) return undefined;
    return Number(digits.slice(-3));
}
function periodPosition(rule, current, context) {
    if (!shouldApplyPositionPattern(rule)) return null;
    const anchorIssue = rule.anchorIssue ? issueSuffix(rule.anchorIssue) : undefined;
    const currentIssue = issueSuffix(current.issue);
    const anchorPatternIndex = rule.anchorPatternIndex ?? 0;
    const periodIndex = anchorIssue !== undefined && currentIssue !== undefined && currentIssue >= 100 ? currentIssue - anchorIssue + anchorPatternIndex : context.periodIndex ?? 0;
    const patternIndex = (periodIndex % rule.positionPattern.length + rule.positionPattern.length) % rule.positionPattern.length;
    const position = rule.positionPattern[patternIndex];
    if (!Number.isInteger(position) || position < 1 || position > 7) {
        throw new Error(`取位序列只能使用 1-7，当前为 ${position}`);
    }
    return {
        position,
        patternIndex,
        periodIndex
    };
}
function patternFromFormula(rule) {
    const match = rule.formula.match(/[平落]([1-7]+)/u);
    if (!match) return [];
    return [
        ...match[1]
    ].map(Number).filter((item)=>item >= 1 && item <= 7);
}
function regularNumberAtPosition(current, position) {
    if (position === 7) return current.special;
    const value = current.lOrder[position - 1];
    if (!Number.isFinite(value)) throw new Error(`未找到第${position}位开奖号`);
    return value;
}
function positionDisplay(position) {
    return position === 7 ? "特码" : `第${position}位`;
}
function formulaForPeriod(rule, current, context) {
    const position = periodPosition(rule, current, context);
    if (!position) return {
        formula: rule.formula,
        patternTrace: [],
        position
    };
    const formula = rule.formula.replace(/([平落])([1-7])(?![\p{Script=Han}\dA-Za-z])/gu, (_match, prefix)=>`${prefix}${position.position}`);
    return {
        formula,
        patternTrace: [
            `取位循环：第 ${position.periodIndex + 1} 期使用序列第 ${position.patternIndex + 1} 位 -> ${formula}`
        ],
        position
    };
}
function incrementNumber(raw, amount) {
    const rounded = Math.round(raw);
    return ((rounded - 1 + amount) % 49 + 49) % 49 + 1;
}
function parityLabel(value) {
    return Math.round(value) % 2 === 0 ? "双" : "单";
}
function parityAdjustment(rule, position) {
    if (!position || !rule.normalizer.includes("4455")) return 0;
    if (position.position === 4) return 1;
    if (position.position === 5) return 2;
    return 0;
}
function calculateSixZodiacRule(rule, current, config) {
    const offsets = zodiacSetOffsetsForRule(rule);
    if (!offsets.length) throw new Error("六肖规则缺少生肖偏移");
    const positions = rule.positionPattern.length ? rule.positionPattern : patternFromFormula(rule);
    if (!positions.length) throw new Error("六肖规则缺少取位序列");
    const rows = offsets.map((offset, index)=>{
        const position = positions[index % positions.length];
        if (!Number.isInteger(position) || position < 1 || position > 7) throw new Error(`取位序列只能使用 1-7，当前为 ${position}`);
        const baseNumber = regularNumberAtPosition(current, position);
        const resultNumber = closedZodiacNumber(baseNumber, offset);
        const base = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(baseNumber, config);
        const result = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(resultNumber, config);
        const sign = offset >= 0 ? `+${offset}` : String(offset);
        return {
            position,
            offset,
            baseNumber,
            resultNumber,
            zodiac: result.zodiac,
            variableKey: `${positionDisplay(position)}${sign}`,
            line: `${positionDisplay(position)} ${String(baseNumber).padStart(2, "0")} ${base.zodiac} ${sign} -> ${String(resultNumber).padStart(2, "0")} ${result.zodiac}`
        };
    });
    const numbers = unique(rows.map((row)=>row.resultNumber));
    const zodiacs = unique(rows.map((row)=>row.zodiac));
    const variables = Object.fromEntries(rows.map((row)=>[
            row.variableKey,
            row.resultNumber
        ]));
    const expression = rows.map((row)=>`平${row.position}${row.offset >= 0 ? "+" : ""}${row.offset}`).join("，");
    return {
        rawResult: numbers[0] ?? 0,
        normalizerSteps: numbers,
        finalResult: zodiacs,
        mappedResult: zodiacs,
        secondaryMappedResult: numbers,
        process: [
            `取位循环：${positions.join("")}；生肖偏移：${offsets.map((offset)=>`${offset >= 0 ? "+" : ""}${offset}`).join(", ")}`,
            ...rows.map((row)=>row.line),
            `六肖 = ${zodiacs.join(", ")}`
        ],
        variables,
        expression,
        trace: rows.map((row)=>row.line)
    };
}
function calculateRuleUncached(rule, current, config, context = {}) {
    if (rule.category === "six_zodiac") {
        return calculateSixZodiacRule(rule, current, config);
    }
    const dynamicFormula = formulaForPeriod(rule, current, context);
    const formula = (0,_lib_formula_evaluate__WEBPACK_IMPORTED_MODULE_1__/* .evaluateFormula */ .w)(dynamicFormula.formula, current, config, rule.orderMode);
    const rawResult = formula.value;
    const trace = [
        ...dynamicFormula.patternTrace,
        ...formula.trace
    ];
    switch(rule.category){
        case "kill_zodiac":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(rawResult);
                const zodiac = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(normalized.value, config).zodiac;
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        zodiac
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 48),
                        `${normalized.value} = ${zodiac}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "include_zodiac":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(rawResult);
                const zodiac = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(normalized.value, config).zodiac;
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        zodiac
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 48),
                        `${normalized.value} = ${zodiac}`,
                        `参考生肖 ${zodiac}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_color":
        case "include_color":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(rawResult);
                const color = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(normalized.value, config).color;
                const actionLabel = rule.category === "kill_color" ? "杀波色" : "参考波色";
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        color
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 48),
                        `${normalized.value} = ${color}`,
                        `${actionLabel} ${color}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_parity":
        case "include_parity":
            {
                const adjustment = parityAdjustment(rule, dynamicFormula.position);
                const adjusted = Math.round(rawResult) + adjustment;
                const parity = parityLabel(adjusted);
                const actionLabel = rule.category === "kill_parity" ? "杀单双" : "参考单双";
                return {
                    rawResult,
                    normalizerSteps: adjustment ? [
                        rawResult,
                        adjusted
                    ] : [
                        rawResult
                    ],
                    finalResult: adjusted,
                    mappedResult: [
                        parity
                    ],
                    process: [
                        ...trace,
                        adjustment ? `${rawResult} + ${adjustment} = ${adjusted}` : `取值 ${rawResult}`,
                        `${adjusted} = ${parity}`,
                        `${actionLabel} ${parity}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_size":
        case "include_size":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(rawResult);
                const size = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(normalized.value, config).size;
                const actionLabel = rule.category === "kill_size" ? "杀大小" : "参考大小";
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        size
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 48),
                        `${normalized.value} = ${size}`,
                        `${actionLabel} ${size}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_sum":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeSum */ .XI)(rawResult);
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        normalized.value
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 13),
                        `杀合 ${normalized.value}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_tail":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeTail */ .KP)(rawResult);
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        normalized.value
                    ],
                    process: [
                        ...trace,
                        `${rawResult} % 10 = ${normalized.value}`,
                        `杀尾 ${normalized.value}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_head":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeHead */ .WF)(rawResult);
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        normalized.value
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 5),
                        `杀头 ${normalized.value}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_element":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeElement */ .Qd)(rawResult);
                const element = Object.entries(config.elementValues).find(([, value])=>value === normalized.value)?.[0] ?? String(normalized.value);
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        element
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 5),
                        `${normalized.value} = ${element}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_segment":
            {
                const normalized = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeSegment */ .jH)(rawResult);
                return {
                    rawResult,
                    normalizerSteps: normalized.steps,
                    finalResult: normalized.value,
                    mappedResult: [
                        normalized.value
                    ],
                    process: [
                        ...trace,
                        ...reductionProcess(normalized.steps, 7),
                        `杀段 ${normalized.value}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "seven_tail":
            {
                const baseTail = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeTail */ .KP)(rawResult).value;
                const offsets = tailOffsetsForRule(rule, config);
                const tails = offsets.map((offset)=>closedTail(baseTail, offset));
                const tailProcess = [
                    ...trace,
                    `七尾闭环基准尾 ${baseTail}`,
                    `0-9 闭环偏移 ${offsets.map((offset)=>`${offset >= 0 ? "+" : ""}${offset}`).join(", ")} -> ${tails.join(", ")}`,
                    ...offsets.map((offset)=>`${baseTail} ${offset >= 0 ? "+" : ""}${offset} -> ${closedTail(baseTail, offset)}`)
                ];
                return {
                    rawResult,
                    normalizerSteps: [
                        rawResult,
                        baseTail
                    ],
                    finalResult: tails,
                    mappedResult: tails,
                    process: tailProcess,
                    legacyProcess: [
                        ...trace,
                        `定位尾 = ${rawResult} % 10 = ${baseTail}`,
                        `七尾偏移 ${config.sevenTailOffsets.join(", ")} -> ${tails.join(", ")}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "eight_zodiac":
            {
                const startNumber = incrementNumber(rawResult, 1);
                const start = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(startNumber, config).zodiac;
                const set = calcEightZodiac(start, config);
                return {
                    rawResult,
                    normalizerSteps: [
                        rawResult,
                        startNumber
                    ],
                    finalResult: set,
                    mappedResult: set,
                    process: [
                        ...trace,
                        `${rawResult} + 1 = ${startNumber}`,
                        `${startNumber} = ${start}`,
                        `八肖 = ${set.join(", ")}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "nine_zodiac":
            {
                const offsets = zodiacOffsetsForRule(rule);
                if (offsets.length) {
                    const set = calcZodiacOffsetSet(rawResult, offsets, config);
                    return {
                        rawResult,
                        normalizerSteps: [
                            rawResult,
                            (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .normalizeZodiacNumber */ .t4)(Math.round(rawResult)).value
                        ],
                        finalResult: set.zodiacs,
                        mappedResult: set.zodiacs,
                        secondaryMappedResult: set.numbers,
                        process: [
                            ...trace,
                            `生肖闭环取值 ${offsets.map((offset)=>`${offset >= 0 ? "+" : ""}${offset}`).join(", ")}`,
                            ...set.lines,
                            `九肖 = ${set.zodiacs.join(", ")}`
                        ],
                        variables: formula.variables,
                        expression: formula.expression,
                        trace
                    };
                }
                const startNumber = incrementNumber(rawResult, 1);
                const start = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(startNumber, config).zodiac;
                const set = calcNineZodiac(start, config);
                return {
                    rawResult,
                    normalizerSteps: [
                        rawResult,
                        startNumber
                    ],
                    finalResult: set,
                    mappedResult: set,
                    process: [
                        ...trace,
                        `${rawResult} + 1 = ${startNumber}`,
                        `${startNumber} = ${start}`,
                        `九肖 = ${set.join(", ")}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "eight_zodiac_two_period":
            {
                const center = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(Math.round(rawResult), config).zodiac;
                const set = calcEightZodiacTwoPeriod(center, config);
                return {
                    rawResult,
                    normalizerSteps: [
                        rawResult
                    ],
                    finalResult: set,
                    mappedResult: set,
                    process: [
                        ...trace,
                        `${rawResult} = ${center}`,
                        `八肖管两期 = ${set.join(", ")}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        case "kill_three_as_nine":
            {
                const center = (0,_lib_engine_attributes__WEBPACK_IMPORTED_MODULE_0__/* .getNumberAttributes */ .hJ)(Math.round(rawResult), config).zodiac;
                const killSet = calcKillThree(center, config);
                const nineSet = config.zodiacOrder.filter((zodiac)=>!killSet.includes(zodiac));
                return {
                    rawResult,
                    normalizerSteps: [
                        rawResult
                    ],
                    finalResult: nineSet,
                    mappedResult: nineSet,
                    secondaryMappedResult: killSet,
                    process: [
                        ...trace,
                        `${rawResult} = ${center}`,
                        `杀三肖 = ${killSet.join(", ")}`,
                        `九肖候选 = ${nineSet.join(", ")}`
                    ],
                    variables: formula.variables,
                    expression: formula.expression,
                    trace
                };
            }
        default:
            return {
                rawResult,
                normalizerSteps: [
                    rawResult
                ],
                finalResult: rawResult,
                mappedResult: [
                    rawResult
                ],
                process: [
                    ...trace,
                    `自定义结果 ${rawResult}`
                ],
                variables: formula.variables,
                expression: formula.expression,
                trace
            };
    }
}
function calculateRule(rule, current, config, context = {}) {
    const key = cacheKey(rule, current, config, context);
    const cached = calculationCache.get(key);
    if (cached) return cloneCalculation(cached);
    const calculation = calculateRuleUncached(rule, current, config, context);
    calculationCache.set(key, cloneCalculation(calculation));
    return cloneCalculation(calculation);
}
function checkRuleSuccess(rule, calculation, future) {
    const resultSet = calculation.mappedResult;
    const special = future.specialAttributes;
    switch(rule.category){
        case "kill_zodiac":
            return !resultSet.includes(special.zodiac);
        case "include_zodiac":
            return resultSet.includes(special.zodiac);
        case "kill_color":
            return !resultSet.includes(special.color);
        case "include_color":
            return resultSet.includes(special.color);
        case "kill_parity":
            return !resultSet.includes(special.parity);
        case "include_parity":
            return resultSet.includes(special.parity);
        case "kill_size":
            return !resultSet.includes(special.size);
        case "include_size":
            return resultSet.includes(special.size);
        case "kill_sum":
            return !resultSet.includes(special.sum);
        case "kill_tail":
            return !resultSet.includes(special.tail);
        case "kill_head":
            return !resultSet.includes(special.head);
        case "kill_element":
            return !resultSet.includes(special.element);
        case "kill_segment":
            return !resultSet.includes(special.segment);
        case "seven_tail":
            return resultSet.includes(special.tail);
        case "six_zodiac":
        case "eight_zodiac":
        case "eight_zodiac_two_period":
        case "nine_zodiac":
        case "kill_three_as_nine":
            return resultSet.includes(special.zodiac);
        default:
            return resultSet.includes(special.number);
    }
}
function targetLabel(rule, calculation) {
    const value = calculation.mappedResult.join("、");
    if (rule.category.startsWith("kill_") && rule.category !== "kill_three_as_nine") return `要杀：${value}`;
    if (rule.category.startsWith("include_")) return `参考：${value}`;
    if (rule.category === "six_zodiac") return `六肖候选：${value}`;
    if (rule.category === "nine_zodiac") return `九肖候选：${value}`;
    if (rule.category === "kill_three_as_nine") return `九肖候选：${value}`;
    return `候选集合：${value}`;
}
function calculateRuleDetail(input) {
    const calculation = calculateRule(input.rule, input.current, input.config, {
        periodIndex: input.periodIndex
    });
    const futureChecks = input.futureDraws.map((future)=>({
            issue: future.issue,
            special: future.special,
            specialAttributes: future.specialAttributes,
            success: checkRuleSuccess(input.rule, calculation, future)
        }));
    const verifyIndex = Math.max(input.rule.verifyOffset ?? 1, 1) - 1;
    const success = futureChecks.length === 0 ? true : input.rule.category === "eight_zodiac_two_period" ? futureChecks.every((item)=>item.success) : futureChecks[verifyIndex]?.success ?? false;
    const next = input.futureDraws[verifyIndex] ?? input.futureDraws[0];
    return {
        ruleId: input.rule.id,
        ruleName: input.rule.name,
        currentIssue: input.current.issue,
        currentNumbers: input.current.lOrder,
        lOrder: input.current.lOrder,
        dOrder: input.current.dOrder,
        formula: calculation.expression,
        variables: calculation.variables,
        expression: calculation.expression,
        process: calculation.process,
        rawResult: calculation.rawResult,
        normalizerSteps: calculation.normalizerSteps,
        finalResult: calculation.finalResult,
        mappedResult: calculation.mappedResult,
        secondaryMappedResult: calculation.secondaryMappedResult,
        targetLabel: targetLabel(input.rule, calculation),
        nextIssue: next?.issue,
        nextNumbers: next?.lOrder,
        nextSpecialAttributes: next?.specialAttributes,
        futureChecks,
        success
    };
}


/***/ }),

/***/ 819:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./src/lib/backtest/run-backtest.ts
var run_backtest = __webpack_require__(2832);
;// ./src/lib/formula-discovery/formula-discovery.ts

const DEFAULT_CATEGORIES = [
    "kill_zodiac",
    "kill_tail",
    "kill_sum",
    "kill_head",
    "kill_segment",
    "kill_element"
];
const DEFAULT_VARIABLES = [
    "平1尾",
    "平2尾",
    "平2五行值",
    "平3合",
    "平4头",
    "平4波色值",
    "平5段",
    "平6尾",
    "特码合",
    "特码五行值",
    "总数尾",
    "期尾"
];
const discoveryCache = new Map();
function discoveryCacheKey(input) {
    return JSON.stringify({
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
        categories: input.categories ?? DEFAULT_CATEGORIES,
        variablePool: input.variablePool ?? DEFAULT_VARIABLES,
        limit: input.limit ?? 20,
        maxTerms: input.maxTerms ?? 3,
        trainRatio: input.trainRatio ?? 0.7,
        minTrainingRate: input.minTrainingRate ?? 50,
        minValidationRate: input.minValidationRate ?? 50,
        combinationLimitPerTerm: input.combinationLimitPerTerm ?? 80,
        config: input.config
    });
}
function cloneCandidate(candidate) {
    return {
        ...candidate,
        rule: {
            ...candidate.rule,
            positionPattern: [
                ...candidate.rule.positionPattern
            ],
            tags: [
                ...candidate.rule.tags
            ],
            examples: [
                ...candidate.rule.examples
            ]
        },
        last10: [
            ...candidate.last10
        ],
        failedIssues: [
            ...candidate.failedIssues
        ],
        details: candidate.details.map((detail)=>({
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
            })),
        trainingResult: {
            ...candidate.trainingResult,
            rule: {
                ...candidate.trainingResult.rule,
                positionPattern: [
                    ...candidate.trainingResult.rule.positionPattern
                ],
                tags: [
                    ...candidate.trainingResult.rule.tags
                ],
                examples: [
                    ...candidate.trainingResult.rule.examples
                ]
            },
            last10: [
                ...candidate.trainingResult.last10
            ],
            failedIssues: [
                ...candidate.trainingResult.failedIssues
            ],
            details: candidate.trainingResult.details
        },
        validationResult: {
            ...candidate.validationResult,
            rule: {
                ...candidate.validationResult.rule,
                positionPattern: [
                    ...candidate.validationResult.rule.positionPattern
                ],
                tags: [
                    ...candidate.validationResult.rule.tags
                ],
                examples: [
                    ...candidate.validationResult.rule.examples
                ]
            },
            last10: [
                ...candidate.validationResult.last10
            ],
            failedIssues: [
                ...candidate.validationResult.failedIssues
            ],
            details: candidate.validationResult.details
        }
    };
}
function clearFormulaDiscoveryCache() {
    discoveryCache.clear();
}
function getFormulaDiscoveryCacheSize() {
    return discoveryCache.size;
}
function normalizerFor(category) {
    switch(category){
        case "kill_zodiac":
            return "subtract_48_to_1_49";
        case "kill_sum":
            return "subtract_13_to_1_13";
        case "kill_tail":
            return "mod_10";
        case "kill_head":
            return "subtract_5_to_0_4";
        case "kill_element":
            return "subtract_5_to_1_5";
        case "kill_segment":
            return "subtract_7_to_1_7";
        case "seven_tail":
            return "tail_offsets";
        case "nine_zodiac":
            return "nine_zodiac";
        default:
            return "auto";
    }
}
function targetFor(category) {
    switch(category){
        case "kill_zodiac":
        case "six_zodiac":
        case "eight_zodiac":
        case "eight_zodiac_two_period":
        case "nine_zodiac":
        case "kill_three_as_nine":
            return "special_zodiac";
        case "kill_sum":
            return "special_sum";
        case "kill_tail":
        case "seven_tail":
            return "special_tail";
        case "kill_head":
            return "special_head";
        case "kill_element":
            return "special_element";
        case "kill_segment":
            return "special_segment";
        default:
            return "special";
    }
}
function combinations(items, maxTerms, exactTerms) {
    const output = [];
    function walk(start, current) {
        if (current.length >= 2 && (!exactTerms || current.length === exactTerms)) output.push([
            ...current
        ]);
        if (current.length >= maxTerms) return;
        for(let index = start; index < items.length; index += 1){
            current.push(items[index]);
            walk(index + 1, current);
            current.pop();
        }
    }
    walk(0, []);
    return output;
}
function spreadSample(items, limit) {
    if (items.length <= limit) return items;
    return Array.from({
        length: limit
    }, (_, index)=>items[Math.floor(index * items.length / limit)]);
}
function makeRule(category, formula, index) {
    const now = new Date().toISOString();
    return {
        id: `auto-${category}-${index}`,
        name: `自动筛选 ${index + 1}`,
        category,
        orderMode: "L",
        formula,
        normalizer: normalizerFor(category),
        target: targetFor(category),
        verifyMode: "next_special",
        positionPattern: [],
        periodSpan: 1,
        enabled: false,
        sourceType: "system_recommended",
        participatesInReference: false,
        tags: [
            "自动筛选"
        ],
        description: "由历史数据自动组合测试生成，加入公式库后才参与综合参考结果。",
        sourceFile: "系统自动筛选",
        examples: [],
        createdAt: now,
        updatedAt: now
    };
}
function splitDraws(draws, ratio) {
    const sorted = [
        ...draws
    ].sort((a, b)=>a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        }));
    const boundedRatio = Math.min(Math.max(ratio, 0.5), 0.85);
    const cut = Math.max(3, Math.min(sorted.length - 2, Math.floor(sorted.length * boundedRatio)));
    return {
        sortedDraws: sorted,
        cut
    };
}
function ruleSpan(rule) {
    return Math.max(rule.periodSpan || 1, rule.verifyOffset || 1, rule.category === "eight_zodiac_two_period" ? 2 : 1);
}
function summarizeResult(result, details) {
    const values = details.map((detail)=>detail.success);
    const success = values.filter(Boolean).length;
    let currentStreak = 0;
    let maxStreak = 0;
    let running = 0;
    for (const value of values){
        if (value) {
            running += 1;
            maxStreak = Math.max(maxStreak, running);
        } else {
            running = 0;
        }
    }
    for(let index = values.length - 1; index >= 0; index -= 1){
        if (!values[index]) break;
        currentStreak += 1;
    }
    return {
        ...result,
        total: details.length,
        success,
        failed: details.length - success,
        successRate: details.length ? Number((success / details.length * 100).toFixed(2)) : 0,
        currentStreak,
        maxStreak,
        last10: values.slice(-10),
        failedIssues: details.filter((detail)=>!detail.success).map((detail)=>detail.currentIssue),
        details
    };
}
function recentRate(result) {
    if (!result.last10.length) return result.successRate;
    return Number((result.last10.filter(Boolean).length / result.last10.length * 100).toFixed(2));
}
function candidateScore(overall, training, validation) {
    const formulaTerms = overall.rule.formula.split("+").length;
    const validationWeight = validation.successRate * 0.45;
    const overallWeight = overall.successRate * 0.25;
    const trainingWeight = training.successRate * 0.15;
    const recentWeight = recentRate(overall) * 0.1;
    const stability = Math.max(0, 25 - Math.abs(training.successRate - validation.successRate)) * 0.25;
    const simplicity = Math.max(0, 6 - formulaTerms) * 1.2;
    return Number((validationWeight + overallWeight + trainingWeight + recentWeight + stability + simplicity + overall.currentStreak * 1.4 - overall.failed * 0.12).toFixed(3));
}
function discoverFormulaCandidates(input) {
    const key = discoveryCacheKey(input);
    const cached = discoveryCache.get(key);
    if (cached) return cached.map(cloneCandidate);
    const categories = input.categories ?? DEFAULT_CATEGORIES;
    const variablePool = input.variablePool ?? DEFAULT_VARIABLES;
    const maxTerms = Math.max(2, Math.min(input.maxTerms ?? 3, 5));
    const minTrainingRate = input.minTrainingRate ?? 50;
    const minValidationRate = input.minValidationRate ?? 50;
    const { sortedDraws, cut } = splitDraws(input.draws, input.trainRatio ?? 0.7);
    const issueIndex = new Map(sortedDraws.map((draw, index)=>[
            draw.issue,
            index
        ]));
    const candidates = [];
    const targetPoolSize = Math.max(input.limit ?? 20, 20) * 2;
    const combinationLimit = Math.max(20, Math.min(input.combinationLimitPerTerm ?? 80, 160));
    for(let termCount = 2; termCount <= maxTerms; termCount += 1){
        const formulas = spreadSample(combinations(variablePool, termCount, termCount), combinationLimit).map((items)=>items.join(" + "));
        const rules = categories.flatMap((category)=>formulas.map((formula, index)=>({
                    ...makeRule(category, formula, index + termCount * 1000),
                    enabled: true
                })));
        const batchResults = (0,run_backtest/* runBacktest */.rt)({
            draws: sortedDraws,
            rules,
            config: input.config
        }).ruleResults;
        batchResults.forEach((result)=>{
            try {
                const span = ruleSpan(result.rule);
                const trainingResult = summarizeResult(result, result.details.filter((detail)=>(issueIndex.get(detail.currentIssue) ?? Number.MAX_SAFE_INTEGER) < cut - span));
                const validationResult = summarizeResult(result, result.details.filter((detail)=>(issueIndex.get(detail.currentIssue) ?? -1) >= cut - 1));
                if (!result || !trainingResult || !validationResult || result.total === 0 || trainingResult.total === 0 || validationResult.total === 0) return;
                if (trainingResult.successRate < minTrainingRate) return;
                if (validationResult.successRate < minValidationRate) return;
                if (validationResult.successRate + 25 < trainingResult.successRate) return;
                candidates.push({
                    ...result,
                    rule: {
                        ...result.rule,
                        enabled: false
                    },
                    trainingRate: trainingResult.successRate,
                    validationRate: validationResult.successRate,
                    trainingResult,
                    validationResult,
                    score: candidateScore(result, trainingResult, validationResult)
                });
            } catch  {
            // Invalid combinations are skipped and shown through the remaining ranked results.
            }
        });
        if (candidates.length >= targetPoolSize) break;
    }
    const result = candidates.sort((a, b)=>b.score - a.score || b.validationRate - a.validationRate || b.successRate - a.successRate || b.currentStreak - a.currentStreak || a.failed - b.failed).slice(0, input.limit ?? 20);
    discoveryCache.set(key, result.map(cloneCandidate));
    return result.map(cloneCandidate);
}

;// ./src/workers/formula-discovery.worker.ts
/// <reference lib="webworker" />

self.onmessage = (event)=>{
    try {
        const candidates = discoverFormulaCandidates({
            draws: event.data.draws,
            config: event.data.config,
            limit: 18,
            maxTerms: event.data.depth === "deep" ? 4 : 3,
            combinationLimitPerTerm: event.data.depth === "deep" ? 80 : 40
        });
        self.postMessage({
            ok: true,
            candidates
        });
    } catch (error) {
        self.postMessage({
            ok: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [890], () => (__webpack_require__(819)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/" + chunkId + "-" + "cfa70cf78013474f" + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScriptURL: (url) => (url)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	(() => {
/******/ 		__webpack_require__.tu = (url) => (__webpack_require__.tt().createScriptURL(url));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/rulequant-terminal-pages/_next/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			802: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.u(chunkId)));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e(890).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;