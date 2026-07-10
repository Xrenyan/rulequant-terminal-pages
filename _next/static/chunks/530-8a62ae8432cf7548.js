(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[530],{

/***/ 680:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sD: () => (/* binding */ calculateRuleDetail),
/* harmony export */   zx: () => (/* binding */ calculateRule)
/* harmony export */ });
/* unused harmony exports clearFormulaEngineCache, getFormulaEngineCacheSize, checkRuleSuccess, targetLabel */
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

/***/ 2422:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  RuleQuantTerminal: () => (/* binding */ RuleQuantTerminal)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5102);
// EXTERNAL MODULE: ./node_modules/.pnpm/framer-motion@12.40.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs + 258 modules
var proxy = __webpack_require__(8730);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/gauge.mjs
var gauge = __webpack_require__(1464);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/play.mjs
var play = __webpack_require__(4471);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/activity.mjs
var activity = __webpack_require__(9918);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/chart-column.mjs
var chart_column = __webpack_require__(6066);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/table-properties.mjs
var table_properties = __webpack_require__(6571);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/layers.mjs
var icons_layers = __webpack_require__(1695);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/clipboard-check.mjs
var clipboard_check = __webpack_require__(1940);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/search.mjs
var search = __webpack_require__(5885);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/settings-2.mjs
var settings_2 = __webpack_require__(5055);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/download.mjs
var download = __webpack_require__(6389);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/upload.mjs
var upload = __webpack_require__(6470);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var refresh_cw = __webpack_require__(3113);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/braces.mjs
var braces = __webpack_require__(6341);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/save.mjs
var icons_save = __webpack_require__(542);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/list-checks.mjs
var list_checks = __webpack_require__(6587);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/plus.mjs
var plus = __webpack_require__(609);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/database.mjs
var database = __webpack_require__(8958);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/file-down.mjs
var file_down = __webpack_require__(3830);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/eye.mjs
var eye = __webpack_require__(4250);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/circle-check.mjs
var circle_check = __webpack_require__(4678);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/circle-x.mjs
var circle_x = __webpack_require__(4134);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/file-braces.mjs
var file_braces = __webpack_require__(4942);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/app-dir/link.js
var app_dir_link = __webpack_require__(3885);
var link_default = /*#__PURE__*/__webpack_require__.n(app_dir_link);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/api/navigation.js
var navigation = __webpack_require__(3278);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2030);
// EXTERNAL MODULE: ./src/lib/backtest/run-backtest.ts
var run_backtest = __webpack_require__(2832);
// EXTERNAL MODULE: ./src/lib/formula-engine/formula-engine.ts
var formula_engine = __webpack_require__(680);
;// ./src/lib/rule-engine/rule-engine.ts

const runRuleCalculation = formula_engine/* calculateRule */.zx;
const runRuleCalculationDetail = (/* unused pure expression or super */ null && (calculateRuleDetail));
const evaluateRuleSuccess = (/* unused pure expression or super */ null && (checkRuleSuccess));


// EXTERNAL MODULE: ./src/lib/engine/attributes.ts
var engine_attributes = __webpack_require__(6353);
;// ./src/lib/scoring/scoring-engine.ts

function attrValue(attributes, targetType) {
    switch(targetType){
        case "number":
            return attributes.number;
        case "zodiac":
            return attributes.zodiac;
        case "color":
            return attributes.color;
        case "parity":
            return attributes.parity;
        case "size":
            return attributes.size;
        case "tail":
            return attributes.tail;
        case "head":
            return attributes.head;
        case "sum":
            return attributes.sum;
        case "element":
            return attributes.element;
        case "segment":
            return attributes.segment;
    }
}
function targetMatches(signal, attributes) {
    const value = attrValue(attributes, signal.targetType);
    return signal.targets.some((target)=>String(target) === String(value));
}
function evidenceFromSignal(signal) {
    return {
        ruleId: signal.ruleId,
        ruleName: signal.ruleName,
        category: signal.category,
        action: signal.action,
        targetType: signal.targetType,
        targets: signal.targets,
        weight: signal.weight,
        scoreDelta: signal.scoreDelta,
        successRate: signal.successRate,
        recentRate: signal.recentRate,
        currentStreak: signal.currentStreak,
        wrongStreak: signal.wrongStreak,
        formula: signal.formula,
        process: signal.process,
        sourceType: signal.sourceType
    };
}
function safeEvidenceFromExcludeSignal(signal) {
    const scoreDelta = Number((signal.weight * 0.12).toFixed(3));
    return {
        ...evidenceFromSignal(signal),
        action: "include",
        targets: [
            `避开${signal.targets.join("、")}`
        ],
        scoreDelta
    };
}
function buildNumberCandidates(config, signals) {
    return Array.from({
        length: 49
    }, (_, index)=>{
        const attributes = (0,engine_attributes/* getNumberAttributes */.hJ)(index + 1, config);
        const supportRules = [];
        const opposeRules = [];
        let score = 0;
        signals.forEach((signal)=>{
            const matched = targetMatches(signal, attributes);
            if (signal.action === "include") {
                if (!matched) return;
                score += signal.scoreDelta;
                supportRules.push(evidenceFromSignal(signal));
                return;
            }
            if (matched) {
                score += signal.scoreDelta;
                opposeRules.push(evidenceFromSignal(signal));
                return;
            }
            const safeEvidence = safeEvidenceFromExcludeSignal(signal);
            score += safeEvidence.scoreDelta;
            supportRules.push(safeEvidence);
        });
        return {
            ...attributes,
            score: Number(score.toFixed(3)),
            supportCount: supportRules.length,
            opposeCount: opposeRules.length,
            supportRules,
            opposeRules
        };
    }).sort((a, b)=>b.score - a.score || b.supportCount - a.supportCount || a.opposeCount - b.opposeCount || a.number - b.number);
}
function uniqueEvidence(items) {
    const seen = new Set();
    return items.filter((item)=>{
        const key = `${item.ruleId}-${item.action}-${item.targetType}-${item.targets.join("/")}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
function aggregateZodiacCandidates(config, numbers) {
    return config.zodiacOrder.map((zodiac)=>{
        const zodiacNumbers = numbers.filter((number)=>number.zodiac === zodiac).sort((a, b)=>a.number - b.number);
        const supportRules = uniqueEvidence(zodiacNumbers.flatMap((number)=>number.supportRules));
        const opposeRules = uniqueEvidence(zodiacNumbers.flatMap((number)=>number.opposeRules));
        const score = zodiacNumbers.length ? zodiacNumbers.reduce((sum, number)=>sum + number.score, 0) / zodiacNumbers.length : 0;
        return {
            zodiac,
            score: Number(score.toFixed(3)),
            numbers: zodiacNumbers,
            supportCount: supportRules.length,
            opposeCount: opposeRules.length,
            supportRules,
            opposeRules
        };
    }).sort((a, b)=>b.score - a.score || b.supportCount - a.supportCount || a.opposeCount - b.opposeCount || config.zodiacOrder.indexOf(a.zodiac) - config.zodiacOrder.indexOf(b.zodiac));
}

;// ./src/lib/rules/rule-validation.ts
function hasAmbiguousPositionVariable(rule) {
    return /(?:^|[+\-*/，,\s])(?:位|平位|落位|定位|次杀位)(?:$|[+\-*/，,\s])/.test(rule.formula);
}
const STATUS_META = {
    checked: {
        label: "已核对",
        tone: "green"
    },
    unchecked: {
        label: "未核对",
        tone: "yellow"
    },
    mismatch: {
        label: "核对不一致",
        tone: "rose"
    },
    failed: {
        label: "计算异常",
        tone: "rose"
    },
    disabled: {
        label: "已停用",
        tone: "slate"
    }
};
function requiresManualConfirmation(rule) {
    return rule.positionPattern.length > 0 || /(取位|平位|位置|未确认)/.test(rule.formula);
}
function canRuleParticipateInReference(rule, summary) {
    if (!rule.enabled) return false;
    if (rule.participatesInReference === false) return false;
    if (rule.sourceType === "example") return false;
    if (hasAmbiguousPositionVariable(rule)) return false;
    if (summary) return summary.canJoinReference;
    return true;
}
function buildRuleValidationSummaries(input) {
    return input.rules.map((rule)=>{
        const sampleResults = input.sampleResults.filter((item)=>item.ruleId === rule.id);
        const backtest = input.backtest.ruleResults.find((item)=>item.rule.id === rule.id);
        const passedSampleCount = sampleResults.filter((item)=>item.passed).length;
        const mismatchCount = sampleResults.length - passedSampleCount;
        let status = "unchecked";
        let reason = "用户提供公式，尚未做手算样例核对；只要公式可计算，仍可参与综合参考。";
        if (!rule.enabled) {
            status = "disabled";
            reason = "公式已停用，不参与一键计算和综合参考。";
        } else if (rule.sourceType === "example") {
            status = "unchecked";
            reason = "示例公式仅用于演示流程，不能混入正式综合参考结果。";
        } else if (hasAmbiguousPositionVariable(rule)) {
            status = "unchecked";
            reason = "公式含未锁定的“位”变量，需要先人工确认具体取值口径，暂不参与综合参考，避免乱算。";
        } else if (!backtest || backtest.total === 0) {
            status = "failed";
            reason = backtest?.error || "公式无法完成回测，请检查变量、公式类型或结果处理方式。";
        } else if (mismatchCount > 0) {
            status = "mismatch";
            reason = "系统计算和手算样例不一致，请重点核对；公式本身仍按用户提供公式参与综合参考。";
        } else if (sampleResults.length > 0 && mismatchCount === 0) {
            status = "checked";
            reason = "已有手算样例核对通过，公式可参与综合参考。";
        } else if (rule.manuallyConfirmed) {
            status = "unchecked";
            reason = "用户已人工确认使用；样例核对仍只是检查程序是否算错，不作为参与门槛。";
        } else if (requiresManualConfirmation(rule)) {
            status = "unchecked";
            reason = "该公式含取位序列或需继续核对，但只要计算正常，仍可参与综合参考。";
        }
        const meta = STATUS_META[status];
        const canJoinReference = rule.enabled && rule.participatesInReference !== false && rule.sourceType !== "example" && !hasAmbiguousPositionVariable(rule) && status !== "failed" && status !== "disabled";
        return {
            ruleId: rule.id,
            status,
            label: meta.label,
            tone: meta.tone,
            canJoinReference,
            reason,
            sampleCount: sampleResults.length,
            passedSampleCount,
            mismatchCount,
            backtest
        };
    });
}

;// ./src/lib/signal-system/signal-system.ts



function sortDraws(draws) {
    return [
        ...draws
    ].sort((a, b)=>{
        const aNumber = /^\d+$/.test(a.issue) ? Number(a.issue) : undefined;
        const bNumber = /^\d+$/.test(b.issue) ? Number(b.issue) : undefined;
        if (aNumber !== undefined && bNumber !== undefined) return aNumber - bNumber;
        if (aNumber !== undefined) return 1;
        if (bNumber !== undefined) return -1;
        return a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        });
    });
}
function recentRate(result) {
    if (!result?.last10.length) return result?.successRate ?? 0;
    return Number((result.last10.filter(Boolean).length / result.last10.length * 100).toFixed(2));
}
function wrongStreak(result) {
    if (!result?.details.length) return 0;
    let count = 0;
    for(let index = result.details.length - 1; index >= 0; index -= 1){
        if (result.details[index].success) break;
        count += 1;
    }
    return count;
}
function ruleWeight(result) {
    const success = result?.successRate ?? 0;
    const recent = recentRate(result);
    const streak = Math.min(result?.currentStreak ?? 0, 10);
    const wrong = Math.min(wrongStreak(result), 12);
    const failedRate = result?.total ? result.failed / result.total : 1;
    return Number(Math.max(0.1, 1 + success / 100 * 0.72 + recent / 100 * 0.5 + streak * 0.06 - wrong * 0.12 - failedRate * 0.45).toFixed(3));
}
function targetForCategory(category) {
    switch(category){
        case "kill_zodiac":
            return {
                action: "exclude",
                targetType: "zodiac"
            };
        case "include_zodiac":
            return {
                action: "include",
                targetType: "zodiac"
            };
        case "kill_color":
            return {
                action: "exclude",
                targetType: "color"
            };
        case "include_color":
            return {
                action: "include",
                targetType: "color"
            };
        case "kill_parity":
            return {
                action: "exclude",
                targetType: "parity"
            };
        case "include_parity":
            return {
                action: "include",
                targetType: "parity"
            };
        case "kill_size":
            return {
                action: "exclude",
                targetType: "size"
            };
        case "include_size":
            return {
                action: "include",
                targetType: "size"
            };
        case "kill_sum":
            return {
                action: "exclude",
                targetType: "sum"
            };
        case "kill_tail":
            return {
                action: "exclude",
                targetType: "tail"
            };
        case "kill_head":
            return {
                action: "exclude",
                targetType: "head"
            };
        case "kill_element":
            return {
                action: "exclude",
                targetType: "element"
            };
        case "kill_segment":
            return {
                action: "exclude",
                targetType: "segment"
            };
        case "seven_tail":
            return {
                action: "include",
                targetType: "tail"
            };
        case "six_zodiac":
        case "eight_zodiac":
        case "eight_zodiac_two_period":
        case "nine_zodiac":
        case "kill_three_as_nine":
            return {
                action: "include",
                targetType: "zodiac"
            };
        default:
            return {
                action: "include",
                targetType: "number"
            };
    }
}
function makeSignal(rule, result, action, targetType, targets, process) {
    const weight = ruleWeight(result);
    return {
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        action,
        targetType,
        targets,
        weight,
        scoreDelta: action === "include" ? weight : -weight,
        successRate: result?.successRate ?? 0,
        recentRate: recentRate(result),
        currentStreak: result?.currentStreak ?? 0,
        wrongStreak: wrongStreak(result),
        formula: rule.formula,
        process,
        sourceType: rule.sourceType ?? "user_provided"
    };
}
function buildRuleSignals(input) {
    const normalizedDraws = sortDraws(input.draws).map((draw)=>(0,engine_attributes/* normalizeDraw */.YC)(draw, input.config));
    const latest = normalizedDraws.at(-1);
    if (!latest) return [];
    const latestPeriodIndex = normalizedDraws.length - 1;
    const validationMap = new Map(input.validationSummaries?.map((summary)=>[
            summary.ruleId,
            summary
        ]));
    return input.rules.filter((rule)=>canRuleParticipateInReference(rule, validationMap.get(rule.id))).flatMap((rule)=>{
        try {
            const calculation = (0,formula_engine/* calculateRule */.zx)(rule, latest, input.config, {
                periodIndex: latestPeriodIndex
            });
            const result = input.backtest?.ruleResults.find((item)=>item.rule.id === rule.id);
            if (rule.category === "kill_three_as_nine") {
                const includeTargets = calculation.mappedResult;
                const excludeTargets = calculation.secondaryMappedResult?.length ? calculation.secondaryMappedResult : input.config.zodiacOrder.filter((zodiac)=>!includeTargets.includes(zodiac));
                return [
                    makeSignal(rule, result, "include", "zodiac", includeTargets, calculation.process),
                    makeSignal(rule, result, "exclude", "zodiac", excludeTargets, calculation.process)
                ];
            }
            const target = targetForCategory(rule.category);
            return [
                makeSignal(rule, result, target.action, target.targetType, calculation.mappedResult, calculation.process)
            ];
        } catch  {
            return [];
        }
    });
}

;// ./src/lib/candidate-pool/candidate-pool.ts




const RISK_NOTICE = "综合参考结果仅用于历史数据研究、规则公式计算和参考排序，不代表一定正确。";
const candidatePoolCache = new Map();
function candidate_pool_sortDraws(draws) {
    return [
        ...draws
    ].sort((a, b)=>{
        const aNumber = /^\d+$/.test(a.issue) ? Number(a.issue) : undefined;
        const bNumber = /^\d+$/.test(b.issue) ? Number(b.issue) : undefined;
        if (aNumber !== undefined && bNumber !== undefined) return aNumber - bNumber;
        if (aNumber !== undefined) return 1;
        if (bNumber !== undefined) return -1;
        return a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        });
    });
}
function candidateCacheKey(input) {
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
        rules: input.rules.map((rule)=>[
                rule.id,
                rule.updatedAt,
                rule.enabled,
                rule.participatesInReference,
                rule.sourceType,
                rule.category,
                rule.orderMode,
                rule.formula,
                rule.normalizer,
                rule.target,
                rule.positionPattern,
                rule.anchorIssue ?? "",
                rule.anchorPatternIndex ?? "",
                rule.periodSpan,
                rule.verifyOffset ?? 1
            ]),
        validation: input.validationSummaries?.map((summary)=>[
                summary.ruleId,
                summary.canJoinReference,
                summary.status
            ]) ?? [],
        backtest: input.backtest?.ruleResults.map((result)=>[
                result.rule.id,
                result.successRate,
                result.currentStreak,
                result.last10
            ]) ?? [],
        config: input.config
    });
}
function clearCandidatePoolCache() {
    candidatePoolCache.clear();
}
function getCandidatePoolCacheSize() {
    return candidatePoolCache.size;
}
function focusedNumberScore(candidate) {
    const strongSupportRules = candidate.supportRules.filter((rule)=>rule.scoreDelta >= 0.45);
    const strongSupportWeight = strongSupportRules.reduce((sum, rule)=>sum + rule.scoreDelta, 0);
    const opposeWeight = candidate.opposeRules.reduce((sum, rule)=>sum + Math.abs(rule.scoreDelta), 0);
    const netEvidence = candidate.supportCount - candidate.opposeCount;
    return Number((candidate.score + strongSupportRules.length * 0.7 + strongSupportWeight * 0.22 + Math.min(netEvidence, 12) * 0.08 - candidate.opposeCount * 0.45 - opposeWeight * 0.12).toFixed(3));
}
function focusedNumbers(candidates, count) {
    const ranked = [
        ...candidates
    ].sort((a, b)=>{
        const scoreDiff = focusedNumberScore(b) - focusedNumberScore(a);
        if (scoreDiff) return scoreDiff;
        return b.score - a.score || b.supportCount - a.supportCount || a.opposeCount - b.opposeCount || a.number - b.number;
    });
    const preferred = ranked.filter((candidate)=>candidate.opposeCount === 0 || candidate.supportCount >= candidate.opposeCount * 2);
    const result = [];
    [
        ...preferred,
        ...ranked
    ].forEach((candidate)=>{
        if (result.length >= count) return;
        if (result.some((item)=>item.number === candidate.number)) return;
        result.push(candidate);
    });
    return result;
}
function generateCandidatePool(input) {
    const key = candidateCacheKey(input);
    const cached = candidatePoolCache.get(key);
    if (cached) return cached;
    const sortedDraws = candidate_pool_sortDraws(input.draws);
    const latestDraw = sortedDraws.at(-1);
    const signals = buildRuleSignals(input);
    const allNumbers = buildNumberCandidates(input.config, signals);
    const allZodiacs = aggregateZodiacCandidates(input.config, allNumbers);
    const participatingRuleIds = new Set(signals.map((signal)=>signal.ruleId));
    const evidencedNumbers = allNumbers.filter((candidate)=>candidate.supportCount + candidate.opposeCount > 0);
    const evidencedZodiacs = allZodiacs.filter((candidate)=>candidate.supportCount + candidate.opposeCount > 0);
    const report = {
        generatedAt: new Date().toISOString(),
        latestIssue: latestDraw?.issue,
        latestDate: latestDraw?.date,
        latestNumbers: latestDraw ? [
            latestDraw.n1,
            latestDraw.n2,
            latestDraw.n3,
            latestDraw.n4,
            latestDraw.n5,
            latestDraw.n6,
            latestDraw.special
        ] : [],
        ruleCount: participatingRuleIds.size,
        signalCount: signals.length,
        signals,
        allNumbers,
        allZodiacs,
        topNumbers8: signals.length ? focusedNumbers(evidencedNumbers, 8) : [],
        topNumbers12: signals.length ? focusedNumbers(evidencedNumbers, 12) : [],
        topNumbers16: signals.length ? evidencedNumbers.slice(0, 16) : [],
        topNumbers18: signals.length ? evidencedNumbers.slice(0, 18) : [],
        topZodiacs7: signals.length ? evidencedZodiacs.slice(0, 7) : [],
        topZodiacs8: signals.length ? evidencedZodiacs.slice(0, 8) : [],
        topZodiacs9: signals.length ? evidencedZodiacs.slice(0, 9) : [],
        riskNotice: RISK_NOTICE
    };
    candidatePoolCache.set(key, report);
    return report;
}
function rate(hits, total) {
    return total ? Number((hits / total * 100).toFixed(2)) : 0;
}
function detailKnownByIssue(detail, knownIssue) {
    if (detail.futureChecks.length) {
        return detail.futureChecks.every((check)=>check.issue.localeCompare(knownIssue, "zh-CN", {
                numeric: true
            }) <= 0);
    }
    if (detail.nextIssue) return detail.nextIssue.localeCompare(knownIssue, "zh-CN", {
        numeric: true
    }) <= 0;
    return detail.currentIssue.localeCompare(knownIssue, "zh-CN", {
        numeric: true
    }) < 0;
}
function streak(values) {
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
    let current = 0;
    for(let index = values.length - 1; index >= 0; index -= 1){
        if (!values[index]) break;
        current += 1;
    }
    return {
        current,
        max
    };
}
function summarizeRuleBacktest(ruleResult, knownIssue) {
    const details = ruleResult.details.filter((detail)=>detailKnownByIssue(detail, knownIssue));
    const values = details.map((detail)=>detail.success);
    const success = values.filter(Boolean).length;
    const streaks = streak(values);
    return {
        ...ruleResult,
        total: details.length,
        success,
        failed: details.length - success,
        successRate: details.length ? Number((success / details.length * 100).toFixed(2)) : 0,
        currentStreak: streaks.current,
        maxStreak: streaks.max,
        last10: values.slice(-10),
        failedIssues: details.filter((detail)=>!detail.success).map((detail)=>detail.currentIssue),
        details
    };
}
function backtestKnownByIssue(backtest, knownIssue) {
    return {
        generatedAt: backtest.generatedAt,
        ruleResults: backtest.ruleResults.map((ruleResult)=>summarizeRuleBacktest(ruleResult, knownIssue))
    };
}
function buildReferenceObservation(input) {
    const sortedDraws = candidate_pool_sortDraws(input.draws);
    const windowSize = input.window ?? 10;
    const startIndex = Math.max(1, sortedDraws.length - windowSize);
    const fullBacktest = input.backtest ?? (0,run_backtest/* runBacktest */.rt)({
        draws: sortedDraws,
        rules: input.rules,
        config: input.config
    });
    const items = sortedDraws.slice(startIndex).flatMap((targetDraw, offset)=>{
        const targetIndex = startIndex + offset;
        const previousDraw = sortedDraws[targetIndex - 1];
        const priorDraws = sortedDraws.slice(0, targetIndex);
        if (!previousDraw || priorDraws.length < 2) return [];
        const report = generateCandidatePool({
            draws: priorDraws,
            rules: input.rules,
            config: input.config,
            backtest: backtestKnownByIssue(fullBacktest, previousDraw.issue),
            validationSummaries: input.validationSummaries
        });
        const attributes = (0,engine_attributes/* getNumberAttributes */.hJ)(targetDraw.special, input.config);
        const top8Numbers = report.topNumbers8.map((candidate)=>candidate.number);
        const top12Numbers = report.topNumbers12.map((candidate)=>candidate.number);
        const top18Numbers = report.topNumbers18.map((candidate)=>candidate.number);
        const top7Zodiacs = report.topZodiacs7.map((candidate)=>candidate.zodiac);
        const top9Zodiacs = report.topZodiacs9.map((candidate)=>candidate.zodiac);
        const hitNumberRank = Math.max(1, report.allNumbers.findIndex((candidate)=>candidate.number === targetDraw.special) + 1);
        return [
            {
                issue: targetDraw.issue,
                previousIssue: previousDraw.issue,
                special: targetDraw.special,
                zodiac: attributes.zodiac,
                top8Numbers,
                top12Numbers,
                top18Numbers,
                top7Zodiacs,
                top9Zodiacs,
                hitTop8: top8Numbers.includes(targetDraw.special),
                hitTop12: top12Numbers.includes(targetDraw.special),
                hitTop18: top18Numbers.includes(targetDraw.special),
                hitZodiac7: top7Zodiacs.includes(attributes.zodiac),
                hitZodiac9: top9Zodiacs.includes(attributes.zodiac),
                hitNumberRank,
                ruleCount: report.ruleCount,
                signalCount: report.signalCount
            }
        ];
    });
    const top8Hits = items.filter((item)=>item.hitTop8).length;
    const top12Hits = items.filter((item)=>item.hitTop12).length;
    const top18Hits = items.filter((item)=>item.hitTop18).length;
    const zodiac7Hits = items.filter((item)=>item.hitZodiac7).length;
    const zodiac9Hits = items.filter((item)=>item.hitZodiac9).length;
    return {
        window: windowSize,
        total: items.length,
        top8Hits,
        top12Hits,
        top18Hits,
        zodiac7Hits,
        zodiac9Hits,
        top8Rate: rate(top8Hits, items.length),
        top12Rate: rate(top12Hits, items.length),
        top18Rate: rate(top18Hits, items.length),
        zodiac7Rate: rate(zodiac7Hits, items.length),
        zodiac9Rate: rate(zodiac9Hits, items.length),
        items
    };
}

;// ./src/lib/config/default-config.ts
const defaultConfig = {
    zodiacTable: {
        马: [
            1,
            13,
            25,
            37,
            49
        ],
        蛇: [
            2,
            14,
            26,
            38
        ],
        龙: [
            3,
            15,
            27,
            39
        ],
        兔: [
            4,
            16,
            28,
            40
        ],
        虎: [
            5,
            17,
            29,
            41
        ],
        牛: [
            6,
            18,
            30,
            42
        ],
        鼠: [
            7,
            19,
            31,
            43
        ],
        猪: [
            8,
            20,
            32,
            44
        ],
        狗: [
            9,
            21,
            33,
            45
        ],
        鸡: [
            10,
            22,
            34,
            46
        ],
        猴: [
            11,
            23,
            35,
            47
        ],
        羊: [
            12,
            24,
            36,
            48
        ]
    },
    zodiacOrder: [
        "马",
        "蛇",
        "龙",
        "兔",
        "虎",
        "牛",
        "鼠",
        "猪",
        "狗",
        "鸡",
        "猴",
        "羊"
    ],
    zodiacClash: {
        鼠: "马",
        牛: "羊",
        虎: "猴",
        兔: "鸡",
        龙: "狗",
        蛇: "猪",
        马: "鼠",
        羊: "牛",
        猴: "虎",
        鸡: "兔",
        狗: "龙",
        猪: "蛇"
    },
    colorTable: {
        红: [
            1,
            2,
            7,
            8,
            12,
            13,
            18,
            19,
            23,
            24,
            29,
            30,
            34,
            35,
            40,
            45,
            46
        ],
        蓝: [
            3,
            4,
            9,
            10,
            14,
            15,
            20,
            25,
            26,
            31,
            36,
            37,
            41,
            42,
            47,
            48
        ],
        绿: [
            5,
            6,
            11,
            16,
            17,
            21,
            22,
            27,
            28,
            32,
            33,
            38,
            39,
            43,
            44,
            49
        ]
    },
    colorValues: {
        红: 0,
        蓝: 1,
        绿: 2
    },
    elementTable: {
        金: [
            4,
            5,
            12,
            13,
            26,
            27,
            34,
            35,
            42,
            43
        ],
        木: [
            8,
            9,
            16,
            17,
            24,
            25,
            38,
            39,
            46,
            47
        ],
        水: [
            1,
            14,
            15,
            22,
            23,
            30,
            31,
            44,
            45
        ],
        火: [
            2,
            3,
            10,
            11,
            18,
            19,
            32,
            33,
            40,
            41,
            48,
            49
        ],
        土: [
            6,
            7,
            20,
            21,
            28,
            29,
            36,
            37
        ]
    },
    elementValues: {
        金: 1,
        木: 2,
        水: 3,
        火: 4,
        土: 5
    },
    segmentRanges: [
        {
            label: 1,
            from: 1,
            to: 7
        },
        {
            label: 2,
            from: 8,
            to: 14
        },
        {
            label: 3,
            from: 15,
            to: 21
        },
        {
            label: 4,
            from: 22,
            to: 28
        },
        {
            label: 5,
            from: 29,
            to: 35
        },
        {
            label: 6,
            from: 36,
            to: 42
        },
        {
            label: 7,
            from: 43,
            to: 49
        }
    ],
    sevenTailOffsets: [
        -3,
        -2,
        -1,
        0,
        1,
        2,
        4
    ],
    eightZodiacPattern: [
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2
    ],
    killThreePattern: [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        2,
        3,
        4,
        5,
        6
    ]
};

;// ./src/lib/formula-ledger/formula-ledger.ts



function padNumber(value) {
    return String(value).padStart(2, "0");
}
function numberWithZodiac(value, config) {
    try {
        return `${padNumber(value)} ${(0,engine_attributes/* getNumberAttributes */.hJ)(value, config).zodiac}`;
    } catch  {
        return padNumber(value);
    }
}
function numbersLabel(numbers, config) {
    if (numbers.length < 7) return numbers.map((number)=>numberWithZodiac(number, config)).join(" ");
    return `${numbers.slice(0, 6).map((number)=>numberWithZodiac(number, config)).join(" ")} + ${numberWithZodiac(numbers[6], config)}`;
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function variableEntries(variables) {
    return Object.entries(variables);
}
function variableLine(variables) {
    const entries = variableEntries(variables);
    return entries.length ? entries.map(([key, value])=>`${key}=${value}`).join(" | ") : "无变量";
}
function equationLine(formula, variables, rawResult) {
    let expression = formula;
    const entries = variableEntries(variables).sort((a, b)=>b[0].length - a[0].length);
    entries.forEach(([key, value])=>{
        expression = expression.replace(new RegExp(escapeRegExp(key), "g"), String(value));
    });
    expression = expression.replace(/\s+/g, " ").trim();
    return `${expression} = ${rawResult}`;
}
function finalOutputLabel(rule, mappedResult) {
    const value = mappedResult.join("、");
    switch(rule.category){
        case "kill_zodiac":
            return `杀${value}`;
        case "include_zodiac":
            return `参考${value}`;
        case "kill_color":
            return `杀波色${value}`;
        case "include_color":
            return `参考波色${value}`;
        case "kill_parity":
            return `杀${value}`;
        case "include_parity":
            return `参考${value}`;
        case "kill_size":
            return `杀${value}`;
        case "include_size":
            return `参考${value}`;
        case "kill_sum":
            return `杀合${value}`;
        case "kill_tail":
            return `杀尾${value}`;
        case "kill_head":
            return `杀头${value}`;
        case "kill_element":
            return `杀${value}`;
        case "kill_segment":
            return `杀段${value}`;
        case "seven_tail":
            return `七尾 ${value}`;
        case "six_zodiac":
            return `六肖 ${value}`;
        case "eight_zodiac":
        case "eight_zodiac_two_period":
            return `八肖 ${value}`;
        case "nine_zodiac":
            return `九肖 ${value}`;
        case "kill_three_as_nine":
            return `九肖 ${value}`;
        default:
            return `输出 ${value}`;
    }
}
function mappingLine(rule, calculation) {
    const mapped = calculation.mappedResult.join("、");
    const finalResult = Array.isArray(calculation.finalResult) ? calculation.finalResult.join("、") : calculation.finalResult;
    switch(rule.category){
        case "kill_zodiac":
        case "include_zodiac":
        case "kill_element":
            return `${finalResult} 对应${mapped}`;
        case "kill_color":
        case "include_color":
            return `${finalResult} 对应波色${mapped}`;
        case "kill_parity":
        case "include_parity":
            return `${finalResult} 对应单双${mapped}`;
        case "kill_size":
        case "include_size":
            return `${finalResult} 对应大小${mapped}`;
        case "kill_sum":
            return `${finalResult} 对应合数${mapped}`;
        case "kill_tail":
            return `${finalResult} 对应尾数${mapped}`;
        case "kill_head":
            return `${finalResult} 对应头数${mapped}`;
        case "kill_segment":
            return `${finalResult} 对应段位${mapped}`;
        case "seven_tail":
            return `计算结果：七尾 ${mapped}`;
        case "six_zodiac":
            return `计算结果：六肖 ${mapped}`;
        case "eight_zodiac":
        case "eight_zodiac_two_period":
            return `计算结果：八肖 ${mapped}`;
        case "nine_zodiac":
            return `计算结果：九肖 ${mapped}`;
        case "kill_three_as_nine":
            return `计算结果：九肖 ${mapped}`;
        default:
            return `计算结果：${mapped}`;
    }
}
function processingLine(detail) {
    const variableKeys = new Set(Object.keys(detail.variables));
    return detail.process.filter((line)=>![
            ...variableKeys
        ].some((key)=>line.startsWith(`${key} =`))).join(" | ");
}
function nextOpenLabel(detail) {
    const next = detail.futureChecks[0];
    if (!next) return "暂无下一期开奖";
    return `${next.issue}期开奖：${padNumber(next.special)} ${next.specialAttributes.zodiac}`;
}
function detailToLedgerEntry(rule, detail, config, isPending = false) {
    const variableText = variableLine(detail.variables);
    const equation = equationLine(detail.formula, detail.variables, detail.rawResult);
    const mapping = mappingLine(rule, detail);
    const output = finalOutputLabel(rule, detail.mappedResult);
    const statusText = isPending ? "待验证" : detail.success ? "正确" : "错误";
    const statusIcon = isPending ? "⏳" : detail.success ? "✅" : "❌";
    const nextLabel = isPending ? "待下一期开奖后自动判断正确或错误" : nextOpenLabel(detail);
    return {
        currentIssue: detail.currentIssue,
        currentNumbersLabel: numbersLabel(detail.currentNumbers, config),
        formula: detail.formula,
        variableLine: variableText,
        equationLine: equation,
        rawResult: detail.rawResult,
        processingLine: processingLine(detail),
        mappingLine: mapping,
        finalOutputLabel: output,
        nextIssue: detail.nextIssue,
        nextOpenLabel: nextLabel,
        statusText,
        statusIcon,
        isFailure: !isPending && !detail.success,
        isPending,
        compactLine: `${detail.currentIssue}期${equation}，${mapping}，本期公式结果：${output}，${nextLabel}，结果：${statusText} ${statusIcon}`,
        detail
    };
}
function buildPendingLatestDetail(rule, draws, config, knownIssues) {
    const latest = draws.at(-1);
    if (!latest || knownIssues.has(latest.issue)) return undefined;
    const current = (0,engine_attributes/* normalizeDraw */.YC)(latest, config);
    const calculation = (0,formula_engine/* calculateRule */.zx)(rule, current, config, {
        periodIndex: Math.max(draws.length - 1, 0)
    });
    return {
        ruleId: rule.id,
        ruleName: rule.name,
        currentIssue: current.issue,
        currentNumbers: current.lOrder,
        lOrder: current.lOrder,
        dOrder: current.dOrder,
        formula: calculation.expression,
        variables: calculation.variables,
        expression: calculation.expression,
        process: calculation.process,
        rawResult: calculation.rawResult,
        normalizerSteps: calculation.normalizerSteps,
        finalResult: calculation.finalResult,
        mappedResult: calculation.mappedResult,
        secondaryMappedResult: calculation.secondaryMappedResult,
        targetLabel: finalOutputLabel(rule, calculation.mappedResult),
        futureChecks: [],
        success: true
    };
}
function buildFormulaLedger(ruleResult, options) {
    const config = options?.config ?? defaultConfig;
    const entries = ruleResult.details.map((detail)=>detailToLedgerEntry(ruleResult.rule, detail, config));
    if (options?.draws.length) {
        const pendingDetail = buildPendingLatestDetail(ruleResult.rule, options.draws, options.config, new Set(ruleResult.details.map((detail)=>detail.currentIssue)));
        if (pendingDetail) entries.push(detailToLedgerEntry(ruleResult.rule, pendingDetail, options.config, true));
    }
    return {
        summary: {
            ruleId: ruleResult.rule.id,
            ruleName: ruleResult.rule.name,
            category: ruleResult.rule.category,
            orderMode: ruleResult.rule.orderMode,
            formula: ruleResult.rule.formula,
            enabled: ruleResult.rule.enabled,
            total: ruleResult.total,
            success: ruleResult.success,
            failed: ruleResult.failed,
            successRate: ruleResult.successRate,
            last10: ruleResult.last10,
            currentStreak: ruleResult.currentStreak,
            maxStreak: ruleResult.maxStreak,
            failedIssues: ruleResult.failedIssues
        },
        entries
    };
}
function buildOneClickFormulaResults(input) {
    let normalized;
    try {
        normalized = (0,engine_attributes/* normalizeDraw */.YC)(input.draw, input.config);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return input.rules.filter((rule)=>rule.enabled).map((rule)=>({
                ruleId: rule.id,
                ruleName: rule.name,
                category: rule.category,
                orderMode: rule.orderMode,
                formula: rule.formula,
                variableLine: "-",
                equationLine: "-",
                rawResult: 0,
                mappingLine: "-",
                finalOutputLabel: "开奖数据异常",
                outputDescription: "开奖数据异常",
                process: [],
                error: message
            }));
    }
    return input.rules.filter((rule)=>rule.enabled).map((rule)=>{
        try {
            const calculation = (0,formula_engine/* calculateRule */.zx)(rule, normalized, input.config, {
                periodIndex: input.periodIndex
            });
            const equation = equationLine(calculation.expression, calculation.variables, calculation.rawResult);
            const output = finalOutputLabel(rule, calculation.mappedResult);
            return {
                ruleId: rule.id,
                ruleName: rule.name,
                category: rule.category,
                orderMode: rule.orderMode,
                formula: calculation.expression,
                variableLine: variableLine(calculation.variables),
                equationLine: equation,
                rawResult: calculation.rawResult,
                mappingLine: mappingLine(rule, calculation),
                finalOutputLabel: output,
                outputDescription: output,
                process: calculation.process
            };
        } catch (error) {
            return {
                ruleId: rule.id,
                ruleName: rule.name,
                category: rule.category,
                orderMode: rule.orderMode,
                formula: rule.formula,
                variableLine: "-",
                equationLine: "-",
                rawResult: 0,
                mappingLine: "-",
                finalOutputLabel: "计算异常",
                outputDescription: "计算异常",
                process: [],
                error: error instanceof Error ? error.message : String(error)
            };
        }
    });
}

// EXTERNAL MODULE: ./node_modules/.pnpm/papaparse@5.5.4/node_modules/papaparse/papaparse.min.js
var papaparse_min = __webpack_require__(5007);
var papaparse_min_default = /*#__PURE__*/__webpack_require__.n(papaparse_min);
// EXTERNAL MODULE: ./node_modules/.pnpm/xlsx@0.18.5/node_modules/xlsx/xlsx.mjs
var xlsx = __webpack_require__(1964);
;// ./src/lib/parsers/draw-html-parser.ts
const COLOR_CLASS_MAP = {
    red: "红",
    blue: "蓝",
    green: "绿"
};
function decodeHtml(value) {
    return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_, code)=>String.fromCharCode(Number(code)));
}
function stripTags(value) {
    return decodeHtml(value.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}
function parseUrlYear(sourceUrl) {
    const match = sourceUrl?.match(/(?:\/|^)(20\d{2})(?:\/\d+)?\.html(?:$|[?#])/);
    return match ? Number(match[1]) : undefined;
}
function colorFromDtAttributes(attributes) {
    const match = attributes.match(/ball-(red|blue|green)/i);
    return match ? COLOR_CLASS_MAP[match[1].toLowerCase()] : undefined;
}
function parseBall(liHtml) {
    const dtMatch = liHtml.match(/<dt\b([^>]*)>([\s\S]*?)<\/dt>/i);
    const ddMatch = liHtml.match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/i);
    if (!dtMatch || !ddMatch) return undefined;
    const number = Number(stripTags(dtMatch[2]).replace(/\D/g, ""));
    if (!Number.isInteger(number) || number < 1 || number > 49) return undefined;
    const attributeText = stripTags(ddMatch[1]).replace(/\s+/g, "");
    const [zodiac, element] = attributeText.split(/[\/／]/).filter(Boolean);
    return {
        number,
        zodiac,
        element,
        color: colorFromDtAttributes(dtMatch[1])
    };
}
function collectBalls(blockHtml) {
    const balls = [];
    const liRegex = /<li\b([^>]*)>[\s\S]*?<\/li>/gi;
    let match;
    while((match = liRegex.exec(blockHtml)) !== null){
        const liHtml = match[0];
        const attributes = match[1];
        if (/\bkj-jia\b/i.test(attributes)) continue;
        const ball = parseBall(liHtml);
        if (ball) balls.push(ball);
    }
    return balls;
}
function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function parseDrawHtml(html, options = {}) {
    const records = [];
    const errors = [];
    const titleRegex = /<div\b[^>]*class=["'][^"']*\bkj-tit\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    const titleMatches = [
        ...html.matchAll(titleRegex)
    ];
    titleMatches.forEach((titleMatch, index)=>{
        const titleHtml = titleMatch[1];
        const titleText = stripTags(titleHtml).replace(/\s+/g, "");
        const dateMatch = titleText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        const issueMatch = titleText.match(/第(\d+)期/) ?? titleHtml.match(/<span\b[^>]*>(\d+)<\/span>\s*期/i);
        const blockStart = titleMatch.index ?? 0;
        const blockEnd = titleMatches[index + 1]?.index ?? html.length;
        const blockHtml = html.slice(blockStart, blockEnd);
        if (!dateMatch || !issueMatch) {
            errors.push(`第 ${index + 1} 个开奖区块缺少日期或期号`);
            return;
        }
        const year = options.year ?? Number(dateMatch[1]) ?? parseUrlYear(options.sourceUrl);
        const month = Number(dateMatch[2]);
        const day = Number(dateMatch[3]);
        const pageIssue = issueMatch[1];
        const balls = collectBalls(blockHtml);
        if (balls.length < 7) {
            errors.push(`${year} 年第 ${pageIssue} 期号码不足 7 个`);
            return;
        }
        const numbers = balls.slice(0, 7).map((ball)=>ball.number);
        const issue = `${year}${pageIssue.padStart(3, "0")}`;
        records.push({
            issue,
            year,
            date: formatDate(year, month, day),
            n1: numbers[0],
            n2: numbers[1],
            n3: numbers[2],
            n4: numbers[3],
            n5: numbers[4],
            n6: numbers[5],
            special: numbers[6],
            sourceUrl: options.sourceUrl,
            rawAttributes: {
                pageIssue,
                balls: balls.slice(0, 7)
            }
        });
    });
    const seen = new Set();
    const uniqueRecords = records.filter((record)=>{
        if (seen.has(record.issue)) {
            errors.push(`重复期号：${record.issue}`);
            return false;
        }
        seen.add(record.issue);
        return true;
    });
    return {
        records: uniqueRecords,
        errors
    };
}
function buildYearUrl(inputUrl, year) {
    const trimmed = inputUrl.trim();
    if (/(?:\/|^)20\d{2}(?:\/\d+)?\.html(?:$|[?#])/.test(trimmed)) {
        return trimmed.replace(/20\d{2}(?=(?:\/\d+)?\.html(?:$|[?#]))/, String(year));
    }
    if (trimmed.endsWith("/")) return `${trimmed}${year}.html`;
    return `${trimmed}/${year}.html`;
}

;// ./src/lib/parsers/draw-parser.ts



const FIELD_ALIASES = {
    issue: "issue",
    期号: "issue",
    date: "date",
    日期: "date",
    n1: "n1",
    落1: "n1",
    平1: "n1",
    n2: "n2",
    落2: "n2",
    平2: "n2",
    n3: "n3",
    落3: "n3",
    平3: "n3",
    n4: "n4",
    落4: "n4",
    平4: "n4",
    n5: "n5",
    落5: "n5",
    平5: "n5",
    n6: "n6",
    落6: "n6",
    平6: "n6",
    special: "special",
    特码: "special",
    特号: "special",
    平7: "special",
    落7: "special"
};
function toNumber(value) {
    if (typeof value === "number") return value;
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return parsed;
}
function normalizeRow(row, rowIndex) {
    const normalized = {};
    for (const [rawKey, value] of Object.entries(row)){
        const key = FIELD_ALIASES[rawKey.trim()];
        if (!key) continue;
        if (key === "issue" || key === "date") {
            normalized[key] = String(value ?? "").trim();
        } else {
            normalized[key] = toNumber(value);
        }
    }
    const required = [
        "issue",
        "n1",
        "n2",
        "n3",
        "n4",
        "n5",
        "n6",
        "special"
    ];
    const missing = required.filter((key)=>normalized[key] === undefined || normalized[key] === "");
    if (missing.length) return {
        error: `第 ${rowIndex + 1} 行缺少字段：${missing.join(", ")}`
    };
    const numbers = [
        normalized.n1,
        normalized.n2,
        normalized.n3,
        normalized.n4,
        normalized.n5,
        normalized.n6,
        normalized.special
    ];
    const invalid = numbers.find((number)=>!Number.isInteger(number) || number < 1 || number > 49);
    if (invalid !== undefined) return {
        error: `第 ${rowIndex + 1} 行号码超出 1-49：${invalid}`
    };
    return {
        record: normalized
    };
}
function parseRows(rows) {
    const records = [];
    const errors = [];
    const seen = new Set();
    rows.forEach((row, index)=>{
        const result = normalizeRow(row, index);
        if (result.error) {
            errors.push(result.error);
            return;
        }
        if (result.record) {
            if (seen.has(result.record.issue)) {
                errors.push(`重复期号：${result.record.issue}`);
            }
            seen.add(result.record.issue);
            records.push(result.record);
        }
    });
    return {
        records,
        errors
    };
}
function parseNoHeader(text) {
    const lines = text.split(/\r?\n/).map((line)=>line.trim()).filter(Boolean);
    const rows = lines.map((line)=>{
        const parts = line.split(/[\s,，\t|]+/).filter(Boolean);
        const [issue, n1, n2, n3, n4, n5, n6, special] = parts;
        return {
            issue,
            n1,
            n2,
            n3,
            n4,
            n5,
            n6,
            special
        };
    });
    return parseRows(rows);
}
function parseDrawText(text) {
    if (/<div\b[^>]*\bkj-tit\b/i.test(text) || /<html\b/i.test(text)) {
        const htmlResult = parseDrawHtml(text);
        if (htmlResult.records.length || htmlResult.errors.length) return htmlResult;
    }
    const parsed = papaparse_min_default().parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header)=>header.trim()
    });
    const headerResult = parseRows(parsed.data);
    if (headerResult.records.length || headerResult.errors.length) return headerResult;
    return parseNoHeader(text);
}
async function parseDrawFile(file) {
    const ext = file.name.toLowerCase().split(".").pop();
    if (ext === "html" || ext === "htm") {
        return parseDrawHtml(await file.text(), {
            sourceUrl: file.name
        });
    }
    if (ext === "xlsx" || ext === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(buffer, {
            type: "array"
        });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet, {
            defval: ""
        });
        return parseRows(rows);
    }
    return parseDrawText(await file.text());
}

;// ./src/lib/parsers/rule-text-parser.ts
const chineseDigits = {
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
function normalizeFormula(value) {
    return value.replace(/[：]/g, ":").replace(/[＋]/g, "+").replace(/[－]/g, "-").replace(/[×]/g, "*").replace(/[÷]/g, "/").replace(/，.*/g, "").trim();
}
function categoryFromText(text, formula) {
    const scope = `${text}\n${formula}`;
    if (/九肖/.test(scope)) return "nine_zodiac";
    if (/八肖管两期|管2期/.test(scope)) return "eight_zodiac_two_period";
    if (/八肖/.test(scope)) return "eight_zodiac";
    if (/七尾/.test(scope)) return "seven_tail";
    if (/杀三肖/.test(scope)) return "kill_three_as_nine";
    if (/杀一?合|合数/.test(scope)) return "kill_sum";
    if (/杀一?尾/.test(scope)) return "kill_tail";
    if (/杀一?头/.test(scope)) return "kill_head";
    if (/杀一?行|五行/.test(scope) && !/[肖尾头合段]/.test(formula)) return "kill_element";
    if (/杀一?段/.test(scope)) return "kill_segment";
    if (/波色|杀波|杀色/.test(scope) && /计算类型[:：]\s*(?:波色|杀波|杀色)/.test(scope)) return "kill_color";
    return "kill_zodiac";
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
        case "eight_zodiac":
            return "eight_zodiac";
        case "eight_zodiac_two_period":
            return "eight_zodiac_two_period";
        case "nine_zodiac":
            return "nine_zodiac_plus_1_three_clash";
        case "kill_three_as_nine":
            return "kill_three_as_nine";
        default:
            return "custom";
    }
}
function targetFor(category) {
    switch(category){
        case "kill_zodiac":
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
        case "kill_color":
        case "include_color":
            return "special_color";
        case "kill_parity":
        case "include_parity":
            return "special_parity";
        case "kill_size":
        case "include_size":
            return "special_size";
        default:
            return "special";
    }
}
function slug(text) {
    const ascii = text.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 36);
    return ascii || Math.random().toString(36).slice(2, 8);
}
function patternFromText(text) {
    if (/1234567\.1234567/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ];
    if (/7654321\.7654321/.test(text)) return [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ];
    if (/7654321\.23456/.test(text)) return [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        2,
        3,
        4,
        5,
        6
    ];
    if (/123456\.5432\.123456\.5432/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2,
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2
    ];
    if (/123456\.5432/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2
    ];
    if (/4455/.test(text)) return [
        4,
        4,
        5,
        5
    ];
    return [];
}
function issuePositionPairs(text) {
    return [
        ...text.matchAll(/(?:20)?(\d{3})\s*平([1-7一二三四五六七])/g)
    ].map((match)=>({
            issue: Number(match[1]),
            position: chineseDigits[match[2]]
        })).filter((item)=>Number.isFinite(item.issue) && Number.isFinite(item.position));
}
function inferAnchor(text, pattern) {
    if (!pattern.length) return {};
    const pairs = issuePositionPairs(text);
    const first = pairs[0];
    if (!first) return {};
    for(let index = 0; index < pattern.length; index += 1){
        if (pattern[index] !== first.position) continue;
        const matchesAll = pairs.every((pair)=>pattern[((pair.issue - first.issue + index) % pattern.length + pattern.length) % pattern.length] === pair.position);
        if (matchesAll) return {
            anchorIssue: `2026${String(first.issue).padStart(3, "0")}`,
            anchorPatternIndex: index
        };
    }
    return {
        anchorIssue: `2026${String(first.issue).padStart(3, "0")}`
    };
}
function formulaLines(text) {
    return text.split(/\r?\n/).map((line)=>line.match(/公式[:：]\s*(.+)$/)?.[1]).filter((line)=>Boolean(line)).map(normalizeFormula);
}
function parseRuleTextFile(text, fileName) {
    const warnings = [];
    const formulas = formulaLines(text);
    const pattern = patternFromText(text);
    const anchor = inferAnchor(text, pattern);
    const now = new Date().toISOString();
    if (!formulas.length && /九肖/.test(text)) {
        formulas.push("平1");
    }
    if (!formulas.length) {
        return {
            rules: [],
            errors: [
                "没有识别到“公式：...”行，也没有识别到可自动结构化的九肖文本。"
            ],
            warnings
        };
    }
    const rules = formulas.map((formula, index)=>{
        const category = categoryFromText(text, formula);
        const orderMode = /D序|D\s*序/.test(text) ? "D" : "L";
        return {
            id: `txt-${slug(fileName)}-${Date.now()}-${index}`,
            name: `${fileName.replace(/\.[^.]+$/, "")}${formulas.length > 1 ? ` - ${index + 1}` : ""}`,
            category,
            orderMode,
            formula,
            normalizer: normalizerFor(category),
            target: targetFor(category),
            verifyMode: "next_special",
            positionPattern: [
                "eight_zodiac",
                "nine_zodiac",
                "kill_three_as_nine",
                "include_parity",
                "kill_parity"
            ].includes(category) ? pattern : [],
            anchorIssue: anchor.anchorIssue,
            anchorPatternIndex: anchor.anchorPatternIndex,
            positionMeaning: pattern.length ? `从 TXT 自动识别取位序列：${pattern.join("")}` : undefined,
            periodSpan: category === "eight_zodiac_two_period" ? 2 : 1,
            enabled: true,
            participatesInReference: true,
            sourceType: "txt_import",
            origin: fileName,
            fromTextId: fileName,
            parseStatus: "parsed",
            verifyStatus: "unchecked",
            tags: [
                "TXT导入",
                category
            ],
            description: `从 TXT 文件“${fileName}”识别导入。导入后请打开逐期明细核对手算样例。`,
            sourceFile: fileName,
            examples: [],
            createdAt: now,
            updatedAt: now
        };
    });
    if (pattern.length && !anchor.anchorIssue) warnings.push("识别到取位序列，但没有找到可作为锚点的期号样例，请在公式编辑器里补锚点。");
    return {
        rules,
        errors: [],
        warnings
    };
}

;// ./src/lib/sample-check/run-sample-checks.ts

function sameValue(expected, actual) {
    return JSON.stringify(expected) === JSON.stringify(actual);
}
function runSampleChecks(input) {
    const backtest = (0,run_backtest/* runBacktest */.rt)({
        draws: input.draws,
        rules: input.rules,
        config: input.config
    });
    return input.cases.map((sampleCase)=>{
        const ruleResult = backtest.ruleResults.find((item)=>item.rule.id === sampleCase.ruleId);
        const detail = ruleResult?.details.find((item)=>item.currentIssue === sampleCase.issue);
        const differences = [];
        if (!detail) {
            return {
                caseId: sampleCase.id,
                ruleId: sampleCase.ruleId,
                issue: sampleCase.issue,
                passed: false,
                differences: [
                    {
                        type: "variable_value",
                        expected: "存在可计算样例",
                        actual: "未找到对应期号或规则"
                    }
                ]
            };
        }
        if (sampleCase.expectedRawResult !== undefined && !sameValue(sampleCase.expectedRawResult, detail.rawResult)) {
            differences.push({
                type: "formula_result",
                expected: sampleCase.expectedRawResult,
                actual: detail.rawResult
            });
        }
        if (sampleCase.expectedFinalResult !== undefined && !sameValue(sampleCase.expectedFinalResult, detail.finalResult)) {
            differences.push({
                type: "normalized_result",
                expected: sampleCase.expectedFinalResult,
                actual: detail.finalResult
            });
        }
        if (sampleCase.expectedMappedResult !== undefined && !sameValue(sampleCase.expectedMappedResult, detail.mappedResult)) {
            differences.push({
                type: "zodiac_mapping",
                expected: sampleCase.expectedMappedResult,
                actual: detail.mappedResult
            });
        }
        if (sampleCase.expectedSuccess !== undefined && !sameValue(sampleCase.expectedSuccess, detail.success)) {
            differences.push({
                type: "verification_result",
                expected: sampleCase.expectedSuccess,
                actual: detail.success
            });
        }
        return {
            caseId: sampleCase.id,
            ruleId: sampleCase.ruleId,
            issue: sampleCase.issue,
            passed: differences.length === 0,
            differences,
            detail
        };
    });
}

;// ./data/sample-draws.json
const sample_draws_namespaceObject = /*#__PURE__*/JSON.parse('[{"issue":"2026001","year":2026,"date":"2026-01-01","n1":27,"n2":8,"n3":43,"n4":33,"n5":42,"n6":11,"special":29,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"001","balls":[{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":43,"zodiac":"猪","element":"水","color":"绿"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":29,"zodiac":"牛","element":"水","color":"红"}]}},{"issue":"2026002","year":2026,"date":"2026-01-02","n1":48,"n2":7,"n3":4,"n4":3,"n5":15,"n6":11,"special":22,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"002","balls":[{"number":48,"zodiac":"马","element":"火","color":"蓝"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":4,"zodiac":"虎","element":"金","color":"蓝"},{"number":3,"zodiac":"兔","element":"金","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":22,"zodiac":"猴","element":"水","color":"绿"}]}},{"issue":"2026003","year":2026,"date":"2026-01-03","n1":30,"n2":44,"n3":7,"n4":15,"n5":42,"n6":17,"special":9,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"003","balls":[{"number":30,"zodiac":"鼠","element":"水","color":"红"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":9,"zodiac":"鸡","element":"火","color":"蓝"}]}},{"issue":"2026004","year":2026,"date":"2026-01-04","n1":22,"n2":19,"n3":7,"n4":35,"n5":49,"n6":36,"special":45,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"004","balls":[{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":45,"zodiac":"鸡","element":"木","color":"红"}]}},{"issue":"2026005","year":2026,"date":"2026-01-05","n1":46,"n2":19,"n3":20,"n4":36,"n5":13,"n6":17,"special":43,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"005","balls":[{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":43,"zodiac":"猪","element":"水","color":"绿"}]}},{"issue":"2026006","year":2026,"date":"2026-01-06","n1":35,"n2":41,"n3":15,"n4":6,"n5":46,"n6":21,"special":13,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"006","balls":[{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":21,"zodiac":"鸡","element":"水","color":"绿"},{"number":13,"zodiac":"蛇","element":"水","color":"红"}]}},{"issue":"2026007","year":2026,"date":"2026-01-07","n1":28,"n2":40,"n3":45,"n4":34,"n5":44,"n6":15,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"007","balls":[{"number":28,"zodiac":"虎","element":"土","color":"绿"},{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":34,"zodiac":"猴","element":"金","color":"红"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"}]}},{"issue":"2026008","year":2026,"date":"2026-01-08","n1":5,"n2":39,"n3":36,"n4":19,"n5":29,"n6":45,"special":21,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"008","balls":[{"number":5,"zodiac":"牛","element":"土","color":"绿"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":29,"zodiac":"牛","element":"水","color":"红"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":21,"zodiac":"鸡","element":"水","color":"绿"}]}},{"issue":"2026009","year":2026,"date":"2026-01-09","n1":17,"n2":18,"n3":6,"n4":49,"n5":7,"n6":22,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"009","balls":[{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":28,"zodiac":"虎","element":"土","color":"绿"}]}},{"issue":"2026010","year":2026,"date":"2026-01-10","n1":23,"n2":38,"n3":24,"n4":49,"n5":11,"n6":30,"special":27,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"010","balls":[{"number":23,"zodiac":"羊","element":"木","color":"红"},{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":24,"zodiac":"马","element":"木","color":"红"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":30,"zodiac":"鼠","element":"水","color":"红"},{"number":27,"zodiac":"兔","element":"土","color":"绿"}]}},{"issue":"2026011","year":2026,"date":"2026-01-11","n1":32,"n2":10,"n3":7,"n4":5,"n5":48,"n6":15,"special":11,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"011","balls":[{"number":32,"zodiac":"狗","element":"火","color":"绿"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":5,"zodiac":"牛","element":"土","color":"绿"},{"number":48,"zodiac":"马","element":"火","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":11,"zodiac":"羊","element":"金","color":"绿"}]}},{"issue":"2026012","year":2026,"date":"2026-01-12","n1":25,"n2":26,"n3":33,"n4":20,"n5":41,"n6":45,"special":11,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"012","balls":[{"number":25,"zodiac":"蛇","element":"金","color":"蓝"},{"number":26,"zodiac":"龙","element":"金","color":"蓝"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":11,"zodiac":"羊","element":"金","color":"绿"}]}},{"issue":"2026013","year":2026,"date":"2026-01-13","n1":9,"n2":19,"n3":44,"n4":27,"n5":37,"n6":6,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"013","balls":[{"number":9,"zodiac":"鸡","element":"火","color":"蓝"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":37,"zodiac":"蛇","element":"木","color":"蓝"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":1,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026014","year":2026,"date":"2026-01-14","n1":38,"n2":13,"n3":12,"n4":8,"n5":43,"n6":31,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"014","balls":[{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":12,"zodiac":"马","element":"金","color":"红"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":43,"zodiac":"猪","element":"水","color":"绿"},{"number":31,"zodiac":"猪","element":"火","color":"蓝"},{"number":26,"zodiac":"龙","element":"金","color":"蓝"}]}},{"issue":"2026015","year":2026,"date":"2026-01-15","n1":10,"n2":8,"n3":30,"n4":20,"n5":15,"n6":33,"special":31,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"015","balls":[{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":30,"zodiac":"鼠","element":"水","color":"红"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":31,"zodiac":"猪","element":"火","color":"蓝"}]}},{"issue":"2026016","year":2026,"date":"2026-01-16","n1":34,"n2":12,"n3":48,"n4":26,"n5":40,"n6":38,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"016","balls":[{"number":34,"zodiac":"猴","element":"金","color":"红"},{"number":12,"zodiac":"马","element":"金","color":"红"},{"number":48,"zodiac":"马","element":"火","color":"蓝"},{"number":26,"zodiac":"龙","element":"金","color":"蓝"},{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"}]}},{"issue":"2026017","year":2026,"date":"2026-01-17","n1":44,"n2":18,"n3":31,"n4":41,"n5":33,"n6":2,"special":32,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"017","balls":[{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":31,"zodiac":"猪","element":"火","color":"蓝"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":2,"zodiac":"龙","element":"火","color":"红"},{"number":32,"zodiac":"狗","element":"火","color":"绿"}]}},{"issue":"2026018","year":2026,"date":"2026-01-18","n1":40,"n2":42,"n3":43,"n4":31,"n5":25,"n6":15,"special":39,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"018","balls":[{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":43,"zodiac":"猪","element":"水","color":"绿"},{"number":31,"zodiac":"猪","element":"火","color":"蓝"},{"number":25,"zodiac":"蛇","element":"金","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":39,"zodiac":"兔","element":"火","color":"绿"}]}},{"issue":"2026019","year":2026,"date":"2026-01-19","n1":42,"n2":22,"n3":45,"n4":19,"n5":7,"n6":25,"special":46,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"019","balls":[{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":25,"zodiac":"蛇","element":"金","color":"蓝"},{"number":46,"zodiac":"猴","element":"木","color":"红"}]}},{"issue":"2026020","year":2026,"date":"2026-01-20","n1":9,"n2":37,"n3":14,"n4":47,"n5":11,"n6":24,"special":12,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"020","balls":[{"number":9,"zodiac":"鸡","element":"火","color":"蓝"},{"number":37,"zodiac":"蛇","element":"木","color":"蓝"},{"number":14,"zodiac":"龙","element":"水","color":"蓝"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":24,"zodiac":"马","element":"木","color":"红"},{"number":12,"zodiac":"马","element":"金","color":"红"}]}},{"issue":"2026021","year":2026,"date":"2026-01-21","n1":47,"n2":45,"n3":33,"n4":7,"n5":24,"n6":10,"special":42,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"021","balls":[{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":24,"zodiac":"马","element":"木","color":"红"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"}]}},{"issue":"2026022","year":2026,"date":"2026-01-22","n1":39,"n2":8,"n3":20,"n4":37,"n5":46,"n6":30,"special":18,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"022","balls":[{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":37,"zodiac":"蛇","element":"木","color":"蓝"},{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":30,"zodiac":"鼠","element":"水","color":"红"},{"number":18,"zodiac":"鼠","element":"火","color":"红"}]}},{"issue":"2026023","year":2026,"date":"2026-01-23","n1":6,"n2":29,"n3":36,"n4":38,"n5":18,"n6":31,"special":47,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"023","balls":[{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":29,"zodiac":"牛","element":"水","color":"红"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":31,"zodiac":"猪","element":"火","color":"蓝"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026024","year":2026,"date":"2026-01-24","n1":10,"n2":45,"n3":25,"n4":15,"n5":23,"n6":44,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"024","balls":[{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":25,"zodiac":"蛇","element":"金","color":"蓝"},{"number":15,"zodiac":"兔","element":"木","color":"蓝"},{"number":23,"zodiac":"羊","element":"木","color":"红"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":28,"zodiac":"虎","element":"土","color":"绿"}]}},{"issue":"2026025","year":2026,"date":"2026-01-25","n1":46,"n2":10,"n3":41,"n4":6,"n5":9,"n6":14,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"025","balls":[{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":9,"zodiac":"鸡","element":"火","color":"蓝"},{"number":14,"zodiac":"龙","element":"水","color":"蓝"},{"number":37,"zodiac":"蛇","element":"木","color":"蓝"}]}},{"issue":"2026026","year":2026,"date":"2026-01-26","n1":44,"n2":34,"n3":24,"n4":13,"n5":37,"n6":42,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"026","balls":[{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":34,"zodiac":"猴","element":"金","color":"红"},{"number":24,"zodiac":"马","element":"木","color":"红"},{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":37,"zodiac":"蛇","element":"木","color":"蓝"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":19,"zodiac":"猪","element":"土","color":"红"}]}},{"issue":"2026027","year":2026,"date":"2026-01-27","n1":11,"n2":16,"n3":46,"n4":10,"n5":18,"n6":49,"special":45,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"027","balls":[{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":16,"zodiac":"虎","element":"木","color":"绿"},{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":45,"zodiac":"鸡","element":"木","color":"红"}]}},{"issue":"2026028","year":2026,"date":"2026-01-28","n1":17,"n2":47,"n3":28,"n4":39,"n5":32,"n6":49,"special":3,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"028","balls":[{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":28,"zodiac":"虎","element":"土","color":"绿"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":32,"zodiac":"狗","element":"火","color":"绿"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":3,"zodiac":"兔","element":"金","color":"蓝"}]}},{"issue":"2026029","year":2026,"date":"2026-01-29","n1":47,"n2":8,"n3":5,"n4":4,"n5":3,"n6":18,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"029","balls":[{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":5,"zodiac":"牛","element":"土","color":"绿"},{"number":4,"zodiac":"虎","element":"金","color":"蓝"},{"number":3,"zodiac":"兔","element":"金","color":"蓝"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":1,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026030","year":2026,"date":"2026-01-30","n1":3,"n2":6,"n3":47,"n4":1,"n5":35,"n6":4,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"030","balls":[{"number":3,"zodiac":"兔","element":"金","color":"蓝"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":1,"zodiac":"蛇","element":"火","color":"红"},{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":4,"zodiac":"虎","element":"金","color":"蓝"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"}]}},{"issue":"2026031","year":2026,"date":"2026-01-31","n1":38,"n2":25,"n3":7,"n4":19,"n5":11,"n6":5,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"031","balls":[{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":25,"zodiac":"蛇","element":"金","color":"蓝"},{"number":7,"zodiac":"猪","element":"木","color":"红"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":5,"zodiac":"牛","element":"土","color":"绿"},{"number":26,"zodiac":"龙","element":"金","color":"蓝"}]}},{"issue":"2026032","year":2026,"date":"2026-02-01","n1":23,"n2":17,"n3":11,"n4":20,"n5":10,"n6":39,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"032","balls":[{"number":23,"zodiac":"羊","element":"木","color":"红"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"}]}},{"issue":"2026033","year":2026,"date":"2026-02-02","n1":14,"n2":22,"n3":46,"n4":33,"n5":8,"n6":11,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"033","balls":[{"number":14,"zodiac":"龙","element":"水","color":"蓝"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"}]}},{"issue":"2026034","year":2026,"date":"2026-02-03","n1":38,"n2":45,"n3":35,"n4":24,"n5":30,"n6":23,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"034","balls":[{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":24,"zodiac":"马","element":"木","color":"红"},{"number":30,"zodiac":"鼠","element":"水","color":"红"},{"number":23,"zodiac":"羊","element":"木","color":"红"},{"number":19,"zodiac":"猪","element":"土","color":"红"}]}},{"issue":"2026035","year":2026,"date":"2026-02-04","n1":32,"n2":47,"n3":44,"n4":36,"n5":19,"n6":41,"special":27,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"035","balls":[{"number":32,"zodiac":"狗","element":"火","color":"绿"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":41,"zodiac":"牛","element":"金","color":"蓝"},{"number":27,"zodiac":"兔","element":"土","color":"绿"}]}},{"issue":"2026036","year":2026,"date":"2026-02-05","n1":44,"n2":39,"n3":11,"n4":20,"n5":27,"n6":48,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"036","balls":[{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":48,"zodiac":"马","element":"火","color":"蓝"},{"number":1,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026037","year":2026,"date":"2026-02-06","n1":34,"n2":42,"n3":39,"n4":13,"n5":44,"n6":45,"special":43,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"037","balls":[{"number":34,"zodiac":"猴","element":"金","color":"红"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":45,"zodiac":"鸡","element":"木","color":"红"},{"number":43,"zodiac":"猪","element":"水","color":"绿"}]}},{"issue":"2026038","year":2026,"date":"2026-02-07","n1":6,"n2":40,"n3":49,"n4":34,"n5":12,"n6":20,"special":42,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"038","balls":[{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":34,"zodiac":"猴","element":"金","color":"红"},{"number":12,"zodiac":"马","element":"金","color":"红"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"}]}},{"issue":"2026039","year":2026,"date":"2026-02-08","n1":31,"n2":20,"n3":8,"n4":29,"n5":10,"n6":4,"special":11,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"039","balls":[{"number":31,"zodiac":"猪","element":"火","color":"蓝"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":29,"zodiac":"牛","element":"水","color":"红"},{"number":10,"zodiac":"猴","element":"火","color":"蓝"},{"number":4,"zodiac":"虎","element":"金","color":"蓝"},{"number":11,"zodiac":"羊","element":"金","color":"绿"}]}},{"issue":"2026040","year":2026,"date":"2026-02-09","n1":46,"n2":6,"n3":29,"n4":27,"n5":11,"n6":49,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"040","balls":[{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":6,"zodiac":"鼠","element":"土","color":"绿"},{"number":29,"zodiac":"牛","element":"水","color":"红"},{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":11,"zodiac":"羊","element":"金","color":"绿"},{"number":49,"zodiac":"蛇","element":"土","color":"绿"},{"number":28,"zodiac":"虎","element":"土","color":"绿"}]}},{"issue":"2026041","year":2026,"date":"2026-02-10","n1":2,"n2":8,"n3":17,"n4":44,"n5":32,"n6":27,"special":36,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"041","balls":[{"number":2,"zodiac":"龙","element":"火","color":"红"},{"number":8,"zodiac":"狗","element":"木","color":"红"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":44,"zodiac":"狗","element":"水","color":"绿"},{"number":32,"zodiac":"狗","element":"火","color":"绿"},{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":36,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026042","year":2026,"date":"2026-02-11","n1":38,"n2":22,"n3":17,"n4":19,"n5":1,"n6":18,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"042","balls":[{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":19,"zodiac":"猪","element":"土","color":"红"},{"number":1,"zodiac":"蛇","element":"火","color":"红"},{"number":18,"zodiac":"鼠","element":"火","color":"红"},{"number":16,"zodiac":"虎","element":"木","color":"绿"}]}},{"issue":"2026043","year":2026,"date":"2026-02-12","n1":9,"n2":35,"n3":42,"n4":40,"n5":33,"n6":3,"special":13,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"043","balls":[{"number":9,"zodiac":"鸡","element":"火","color":"蓝"},{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":33,"zodiac":"鸡","element":"金","color":"绿"},{"number":3,"zodiac":"兔","element":"金","color":"蓝"},{"number":13,"zodiac":"蛇","element":"水","color":"红"}]}},{"issue":"2026044","year":2026,"date":"2026-02-13","n1":46,"n2":17,"n3":39,"n4":47,"n5":48,"n6":38,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"044","balls":[{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":17,"zodiac":"牛","element":"火","color":"绿"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":48,"zodiac":"马","element":"火","color":"蓝"},{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":19,"zodiac":"猪","element":"土","color":"红"}]}},{"issue":"2026045","year":2026,"date":"2026-02-14","n1":20,"n2":38,"n3":22,"n4":13,"n5":42,"n6":27,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"045","balls":[{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":38,"zodiac":"龙","element":"木","color":"绿"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":27,"zodiac":"兔","element":"土","color":"绿"},{"number":1,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026046","year":2026,"date":"2026-02-15","n1":13,"n2":9,"n3":20,"n4":22,"n5":39,"n6":36,"special":3,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"046","balls":[{"number":13,"zodiac":"蛇","element":"水","color":"红"},{"number":9,"zodiac":"鸡","element":"火","color":"蓝"},{"number":20,"zodiac":"狗","element":"土","color":"蓝"},{"number":22,"zodiac":"猴","element":"水","color":"绿"},{"number":39,"zodiac":"兔","element":"火","color":"绿"},{"number":36,"zodiac":"马","element":"土","color":"蓝"},{"number":3,"zodiac":"兔","element":"金","color":"蓝"}]}},{"issue":"2026047","year":2026,"date":"2026-02-16","n1":40,"n2":35,"n3":23,"n4":42,"n5":46,"n6":47,"special":39,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"047","balls":[{"number":40,"zodiac":"虎","element":"火","color":"红"},{"number":35,"zodiac":"羊","element":"土","color":"红"},{"number":23,"zodiac":"羊","element":"木","color":"红"},{"number":42,"zodiac":"鼠","element":"金","color":"蓝"},{"number":46,"zodiac":"猴","element":"木","color":"红"},{"number":47,"zodiac":"羊","element":"火","color":"蓝"},{"number":39,"zodiac":"兔","element":"火","color":"绿"}]}},{"issue":"2026048","year":2026,"date":"2026-02-17","n1":8,"n2":38,"n3":29,"n4":32,"n5":46,"n6":16,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"048","balls":[{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026049","year":2026,"date":"2026-02-18","n1":28,"n2":42,"n3":22,"n4":49,"n5":12,"n6":31,"special":13,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"049","balls":[{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":13,"zodiac":"马","element":"金","color":"红"}]}},{"issue":"2026050","year":2026,"date":"2026-02-19","n1":10,"n2":13,"n3":30,"n4":37,"n5":33,"n6":44,"special":23,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"050","balls":[{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":23,"zodiac":"猴","element":"水","color":"红"}]}},{"issue":"2026051","year":2026,"date":"2026-02-20","n1":40,"n2":42,"n3":44,"n4":6,"n5":14,"n6":38,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"051","balls":[{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026052","year":2026,"date":"2026-02-21","n1":15,"n2":46,"n3":14,"n4":13,"n5":40,"n6":35,"special":38,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"052","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"}]}},{"issue":"2026053","year":2026,"date":"2026-02-22","n1":16,"n2":12,"n3":33,"n4":17,"n5":41,"n6":18,"special":15,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"053","balls":[{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"}]}},{"issue":"2026054","year":2026,"date":"2026-02-23","n1":37,"n2":30,"n3":11,"n4":19,"n5":49,"n6":32,"special":48,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"054","balls":[{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026055","year":2026,"date":"2026-02-24","n1":31,"n2":28,"n3":20,"n4":21,"n5":39,"n6":9,"special":14,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"055","balls":[{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"}]}},{"issue":"2026056","year":2026,"date":"2026-02-25","n1":45,"n2":9,"n3":6,"n4":7,"n5":10,"n6":26,"special":48,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"056","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026057","year":2026,"date":"2026-02-26","n1":21,"n2":29,"n3":40,"n4":30,"n5":26,"n6":34,"special":23,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"057","balls":[{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"}]}},{"issue":"2026058","year":2026,"date":"2026-02-27","n1":20,"n2":38,"n3":13,"n4":21,"n5":33,"n6":40,"special":31,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"058","balls":[{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"}]}},{"issue":"2026059","year":2026,"date":"2026-02-28","n1":29,"n2":19,"n3":24,"n4":43,"n5":28,"n6":12,"special":10,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"059","balls":[{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"}]}},{"issue":"2026060","year":2026,"date":"2026-03-01","n1":5,"n2":27,"n3":40,"n4":34,"n5":39,"n6":1,"special":9,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"060","balls":[{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"}]}},{"issue":"2026061","year":2026,"date":"2026-03-02","n1":46,"n2":17,"n3":8,"n4":25,"n5":2,"n6":37,"special":29,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"061","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"}]}},{"issue":"2026062","year":2026,"date":"2026-03-03","n1":46,"n2":29,"n3":6,"n4":49,"n5":35,"n6":42,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"062","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026063","year":2026,"date":"2026-03-04","n1":36,"n2":26,"n3":37,"n4":2,"n5":44,"n6":31,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"063","balls":[{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":28,"zodiac":"兔","element":"土","color":"绿"}]}},{"issue":"2026064","year":2026,"date":"2026-03-05","n1":8,"n2":23,"n3":40,"n4":44,"n5":34,"n6":2,"special":18,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"064","balls":[{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":18,"zodiac":"牛","element":"火","color":"红"}]}},{"issue":"2026065","year":2026,"date":"2026-03-06","n1":2,"n2":45,"n3":17,"n4":38,"n5":33,"n6":24,"special":5,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"065","balls":[{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"}]}},{"issue":"2026066","year":2026,"date":"2026-03-07","n1":24,"n2":20,"n3":36,"n4":44,"n5":2,"n6":28,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"066","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026067","year":2026,"date":"2026-03-08","n1":15,"n2":30,"n3":6,"n4":1,"n5":26,"n6":9,"special":5,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"067","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":5,"zodiac":"虎","element":"金","color":"绿"}]}},{"issue":"2026068","year":2026,"date":"2026-03-09","n1":49,"n2":2,"n3":1,"n4":26,"n5":38,"n6":21,"special":23,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"068","balls":[{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":23,"zodiac":"猴","element":"水","color":"红"}]}},{"issue":"2026069","year":2026,"date":"2026-03-10","n1":23,"n2":16,"n3":10,"n4":34,"n5":8,"n6":36,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"069","balls":[{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026070","year":2026,"date":"2026-03-11","n1":47,"n2":17,"n3":23,"n4":10,"n5":41,"n6":7,"special":25,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"070","balls":[{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":25,"zodiac":"马","element":"木","color":"蓝"}]}},{"issue":"2026071","year":2026,"date":"2026-03-12","n1":44,"n2":30,"n3":25,"n4":5,"n5":41,"n6":8,"special":48,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"071","balls":[{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026072","year":2026,"date":"2026-03-13","n1":12,"n2":28,"n3":1,"n4":42,"n5":25,"n6":44,"special":46,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"072","balls":[{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"}]}},{"issue":"2026073","year":2026,"date":"2026-03-14","n1":7,"n2":29,"n3":1,"n4":33,"n5":36,"n6":14,"special":34,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"073","balls":[{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":34,"zodiac":"鸡","element":"金","color":"红"}]}},{"issue":"2026074","year":2026,"date":"2026-03-15","n1":12,"n2":31,"n3":49,"n4":25,"n5":24,"n6":32,"special":10,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"074","balls":[{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"}]}},{"issue":"2026075","year":2026,"date":"2026-03-16","n1":19,"n2":22,"n3":26,"n4":20,"n5":41,"n6":27,"special":33,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"075","balls":[{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"}]}},{"issue":"2026076","year":2026,"date":"2026-03-17","n1":12,"n2":7,"n3":24,"n4":22,"n5":3,"n6":41,"special":2,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"076","balls":[{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026077","year":2026,"date":"2026-03-18","n1":37,"n2":32,"n3":46,"n4":25,"n5":39,"n6":30,"special":29,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"077","balls":[{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"}]}},{"issue":"2026078","year":2026,"date":"2026-03-19","n1":18,"n2":17,"n3":10,"n4":33,"n5":2,"n6":8,"special":46,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"078","balls":[{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":46,"zodiac":"鸡","element":"木","color":"红"}]}},{"issue":"2026079","year":2026,"date":"2026-03-20","n1":49,"n2":34,"n3":6,"n4":20,"n5":4,"n6":43,"special":35,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"079","balls":[{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":35,"zodiac":"猴","element":"金","color":"红"}]}},{"issue":"2026080","year":2026,"date":"2026-03-21","n1":21,"n2":18,"n3":17,"n4":48,"n5":9,"n6":42,"special":3,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"080","balls":[{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"}]}},{"issue":"2026081","year":2026,"date":"2026-03-22","n1":4,"n2":36,"n3":14,"n4":15,"n5":35,"n6":41,"special":17,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"081","balls":[{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"}]}},{"issue":"2026082","year":2026,"date":"2026-03-23","n1":3,"n2":21,"n3":33,"n4":37,"n5":41,"n6":25,"special":27,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"082","balls":[{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":27,"zodiac":"龙","element":"金","color":"绿"}]}},{"issue":"2026083","year":2026,"date":"2026-03-24","n1":46,"n2":8,"n3":23,"n4":36,"n5":30,"n6":1,"special":5,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"083","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"}]}},{"issue":"2026084","year":2026,"date":"2026-03-25","n1":7,"n2":24,"n3":2,"n4":5,"n5":20,"n6":31,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"084","balls":[{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026085","year":2026,"date":"2026-03-26","n1":14,"n2":13,"n3":27,"n4":33,"n5":6,"n6":20,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"085","balls":[{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"}]}},{"issue":"2026086","year":2026,"date":"2026-03-27","n1":15,"n2":36,"n3":14,"n4":24,"n5":26,"n6":34,"special":12,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"086","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":12,"zodiac":"羊","element":"金","color":"红"}]}},{"issue":"2026087","year":2026,"date":"2026-03-28","n1":17,"n2":1,"n3":21,"n4":29,"n5":47,"n6":2,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"087","balls":[{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"}]}},{"issue":"2026088","year":2026,"date":"2026-03-29","n1":16,"n2":46,"n3":18,"n4":10,"n5":12,"n6":42,"special":27,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"088","balls":[{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":27,"zodiac":"龙","element":"金","color":"绿"}]}},{"issue":"2026089","year":2026,"date":"2026-03-30","n1":26,"n2":44,"n3":34,"n4":5,"n5":21,"n6":22,"special":49,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"089","balls":[{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"}]}},{"issue":"2026090","year":2026,"date":"2026-03-31","n1":48,"n2":29,"n3":20,"n4":17,"n5":37,"n6":8,"special":36,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"090","balls":[{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"}]}},{"issue":"2026091","year":2026,"date":"2026-04-01","n1":8,"n2":17,"n3":32,"n4":5,"n5":42,"n6":24,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"091","balls":[{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026092","year":2026,"date":"2026-04-02","n1":46,"n2":42,"n3":25,"n4":47,"n5":38,"n6":19,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"092","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"}]}},{"issue":"2026093","year":2026,"date":"2026-04-03","n1":13,"n2":18,"n3":26,"n4":47,"n5":48,"n6":4,"special":40,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"093","balls":[{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":40,"zodiac":"兔","element":"火","color":"红"}]}},{"issue":"2026094","year":2026,"date":"2026-04-04","n1":16,"n2":25,"n3":4,"n4":28,"n5":43,"n6":38,"special":17,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"094","balls":[{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"}]}},{"issue":"2026095","year":2026,"date":"2026-04-05","n1":15,"n2":39,"n3":1,"n4":38,"n5":21,"n6":48,"special":35,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"095","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":35,"zodiac":"猴","element":"金","color":"红"}]}},{"issue":"2026096","year":2026,"date":"2026-04-06","n1":35,"n2":37,"n3":26,"n4":5,"n5":25,"n6":15,"special":43,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"096","balls":[{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"}]}},{"issue":"2026097","year":2026,"date":"2026-04-07","n1":28,"n2":8,"n3":44,"n4":26,"n5":29,"n6":46,"special":11,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"097","balls":[{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"}]}},{"issue":"2026098","year":2026,"date":"2026-04-08","n1":24,"n2":8,"n3":3,"n4":14,"n5":32,"n6":49,"special":17,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"098","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"}]}},{"issue":"2026099","year":2026,"date":"2026-04-09","n1":10,"n2":32,"n3":22,"n4":18,"n5":28,"n6":17,"special":12,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"099","balls":[{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"}]}},{"issue":"2026100","year":2026,"date":"2026-04-10","n1":24,"n2":45,"n3":4,"n4":32,"n5":3,"n6":48,"special":33,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"100","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"}]}},{"issue":"2026101","year":2026,"date":"2026-04-11","n1":22,"n2":8,"n3":2,"n4":34,"n5":20,"n6":12,"special":39,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"101","balls":[{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"}]}},{"issue":"2026102","year":2026,"date":"2026-04-12","n1":47,"n2":3,"n3":32,"n4":46,"n5":39,"n6":36,"special":20,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"102","balls":[{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"}]}},{"issue":"2026103","year":2026,"date":"2026-04-13","n1":34,"n2":3,"n3":1,"n4":30,"n5":39,"n6":4,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"103","balls":[{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":6,"zodiac":"牛","element":"土","color":"绿"}]}},{"issue":"2026104","year":2026,"date":"2026-04-14","n1":20,"n2":45,"n3":39,"n4":49,"n5":3,"n6":48,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"104","balls":[{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026105","year":2026,"date":"2026-04-15","n1":32,"n2":44,"n3":17,"n4":19,"n5":11,"n6":36,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"105","balls":[{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":28,"zodiac":"兔","element":"土","color":"绿"}]}},{"issue":"2026106","year":2026,"date":"2026-04-16","n1":31,"n2":48,"n3":5,"n4":11,"n5":46,"n6":40,"special":22,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"106","balls":[{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"}]}},{"issue":"2026107","year":2026,"date":"2026-04-17","n1":35,"n2":10,"n3":41,"n4":43,"n5":34,"n6":6,"special":49,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"107","balls":[{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"}]}},{"issue":"2026108","year":2026,"date":"2026-04-18","n1":6,"n2":30,"n3":26,"n4":14,"n5":48,"n6":40,"special":45,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"108","balls":[{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"}]}},{"issue":"2026109","year":2026,"date":"2026-04-19","n1":38,"n2":7,"n3":19,"n4":24,"n5":43,"n6":8,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"109","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026110","year":2026,"date":"2026-04-20","n1":40,"n2":3,"n3":43,"n4":29,"n5":45,"n6":19,"special":30,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"110","balls":[{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"}]}},{"issue":"2026111","year":2026,"date":"2026-04-21","n1":24,"n2":23,"n3":21,"n4":41,"n5":38,"n6":33,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"111","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026112","year":2026,"date":"2026-04-22","n1":15,"n2":19,"n3":30,"n4":7,"n5":44,"n6":10,"special":9,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"112","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"}]}},{"issue":"2026113","year":2026,"date":"2026-04-23","n1":42,"n2":22,"n3":15,"n4":17,"n5":32,"n6":49,"special":2,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"113","balls":[{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026114","year":2026,"date":"2026-04-24","n1":45,"n2":41,"n3":10,"n4":1,"n5":36,"n6":25,"special":30,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"114","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"}]}},{"issue":"2026115","year":2026,"date":"2026-04-25","n1":21,"n2":16,"n3":25,"n4":29,"n5":8,"n6":7,"special":4,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"115","balls":[{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"}]}},{"issue":"2026116","year":2026,"date":"2026-04-26","n1":15,"n2":46,"n3":16,"n4":10,"n5":48,"n6":33,"special":22,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"116","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"}]}},{"issue":"2026117","year":2026,"date":"2026-04-27","n1":45,"n2":2,"n3":46,"n4":33,"n5":19,"n6":7,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"117","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026118","year":2026,"date":"2026-04-28","n1":38,"n2":37,"n3":22,"n4":46,"n5":49,"n6":40,"special":8,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"118","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"}]}},{"issue":"2026119","year":2026,"date":"2026-04-29","n1":38,"n2":18,"n3":32,"n4":22,"n5":30,"n6":40,"special":11,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"119","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"}]}},{"issue":"2026120","year":2026,"date":"2026-04-30","n1":18,"n2":24,"n3":7,"n4":23,"n5":48,"n6":20,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"120","balls":[{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":6,"zodiac":"牛","element":"土","color":"绿"}]}},{"issue":"2026121","year":2026,"date":"2026-05-01","n1":45,"n2":21,"n3":35,"n4":48,"n5":6,"n6":20,"special":44,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"121","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"}]}},{"issue":"2026122","year":2026,"date":"2026-05-02","n1":18,"n2":23,"n3":15,"n4":22,"n5":25,"n6":45,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"122","balls":[{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026123","year":2026,"date":"2026-05-03","n1":39,"n2":23,"n3":49,"n4":17,"n5":42,"n6":44,"special":46,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"123","balls":[{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"}]}},{"issue":"2026124","year":2026,"date":"2026-05-04","n1":46,"n2":5,"n3":10,"n4":17,"n5":12,"n6":22,"special":39,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"124","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":39,"zodiac":"龙","element":"木","color":"绿"}]}},{"issue":"2026125","year":2026,"date":"2026-05-05","n1":16,"n2":19,"n3":7,"n4":30,"n5":38,"n6":39,"special":31,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"125","balls":[{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"}]}},{"issue":"2026126","year":2026,"date":"2026-05-06","n1":15,"n2":9,"n3":5,"n4":3,"n5":1,"n6":10,"special":49,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"126","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":49,"zodiac":"马","element":"火","color":"绿"}]}},{"issue":"2026127","year":2026,"date":"2026-05-07","n1":14,"n2":8,"n3":27,"n4":3,"n5":7,"n6":29,"special":45,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"127","balls":[{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"}]}},{"issue":"2026128","year":2026,"date":"2026-05-08","n1":25,"n2":46,"n3":2,"n4":7,"n5":45,"n6":42,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"128","balls":[{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026129","year":2026,"date":"2026-05-09","n1":34,"n2":7,"n3":40,"n4":21,"n5":17,"n6":25,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"129","balls":[{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"}]}},{"issue":"2026130","year":2026,"date":"2026-05-10","n1":41,"n2":26,"n3":9,"n4":11,"n5":5,"n6":25,"special":29,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"130","balls":[{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"}]}},{"issue":"2026131","year":2026,"date":"2026-05-11","n1":12,"n2":40,"n3":21,"n4":32,"n5":1,"n6":25,"special":7,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"131","balls":[{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":7,"zodiac":"鼠","element":"土","color":"红"}]}},{"issue":"2026132","year":2026,"date":"2026-05-12","n1":48,"n2":11,"n3":20,"n4":44,"n5":39,"n6":35,"special":30,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"132","balls":[{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"}]}},{"issue":"2026133","year":2026,"date":"2026-05-13","n1":38,"n2":14,"n3":23,"n4":1,"n5":26,"n6":44,"special":7,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"133","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"}]}},{"issue":"2026134","year":2026,"date":"2026-05-14","n1":24,"n2":46,"n3":40,"n4":44,"n5":22,"n6":49,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"134","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026135","year":2026,"date":"2026-05-15","n1":8,"n2":35,"n3":9,"n4":20,"n5":18,"n6":47,"special":30,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"135","balls":[{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"}]}},{"issue":"2026136","year":2026,"date":"2026-05-16","n1":1,"n2":14,"n3":24,"n4":17,"n5":15,"n6":12,"special":48,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"136","balls":[{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026137","year":2026,"date":"2026-05-17","n1":24,"n2":20,"n3":32,"n4":5,"n5":19,"n6":7,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"137","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"}]}},{"issue":"2026138","year":2026,"date":"2026-05-18","n1":38,"n2":22,"n3":6,"n4":24,"n5":20,"n6":46,"special":49,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"138","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":49,"zodiac":"马","element":"火","color":"绿"}]}},{"issue":"2026139","year":2026,"date":"2026-05-19","n1":41,"n2":45,"n3":48,"n4":1,"n5":36,"n6":30,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"139","balls":[{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026140","year":2026,"date":"2026-05-20","n1":13,"n2":10,"n3":42,"n4":4,"n5":46,"n6":34,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"140","balls":[{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026141","year":2026,"date":"2026-05-21","n1":43,"n2":8,"n3":17,"n4":2,"n5":34,"n6":32,"special":33,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"141","balls":[{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"}]}},{"issue":"2026142","year":2026,"date":"2026-05-22","n1":45,"n2":15,"n3":26,"n4":21,"n5":18,"n6":35,"special":23,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"142","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"}]}},{"issue":"2026143","year":2026,"date":"2026-05-23","n1":13,"n2":26,"n3":18,"n4":32,"n5":2,"n6":33,"special":44,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"143","balls":[{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":44,"zodiac":"猪","element":"水","color":"绿"}]}},{"issue":"2026144","year":2026,"date":"2026-05-24","n1":47,"n2":31,"n3":29,"n4":33,"n5":22,"n6":26,"special":43,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"144","balls":[{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"}]}},{"issue":"2026145","year":2026,"date":"2026-05-25","n1":36,"n2":43,"n3":25,"n4":32,"n5":37,"n6":18,"special":5,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"145","balls":[{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":32,"zodiac":"猪","element":"火","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"}]}},{"issue":"2026146","year":2026,"date":"2026-05-26","n1":11,"n2":30,"n3":20,"n4":19,"n5":5,"n6":16,"special":42,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"146","balls":[{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"}]}},{"issue":"2026147","year":2026,"date":"2026-05-27","n1":29,"n2":40,"n3":6,"n4":18,"n5":31,"n6":10,"special":13,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"147","balls":[{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":13,"zodiac":"马","element":"金","color":"红"}]}},{"issue":"2026148","year":2026,"date":"2026-05-28","n1":28,"n2":24,"n3":31,"n4":23,"n5":4,"n6":27,"special":48,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"148","balls":[{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"}]}},{"issue":"2026149","year":2026,"date":"2026-05-29","n1":28,"n2":30,"n3":44,"n4":45,"n5":4,"n6":20,"special":27,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"149","balls":[{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":27,"zodiac":"龙","element":"金","color":"绿"}]}},{"issue":"2026150","year":2026,"date":"2026-05-30","n1":11,"n2":4,"n3":22,"n4":25,"n5":44,"n6":19,"special":9,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"150","balls":[{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"}]}},{"issue":"2026151","year":2026,"date":"2026-05-31","n1":27,"n2":15,"n3":29,"n4":42,"n5":20,"n6":41,"special":31,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"151","balls":[{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"}]}},{"issue":"2026152","year":2026,"date":"2026-06-01","n1":34,"n2":47,"n3":16,"n4":36,"n5":44,"n6":1,"special":45,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"152","balls":[{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":45,"zodiac":"狗","element":"水","color":"红"}]}},{"issue":"2026153","year":2026,"date":"2026-06-02","n1":1,"n2":38,"n3":33,"n4":28,"n5":6,"n6":40,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"153","balls":[{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"}]}},{"issue":"2026154","year":2026,"date":"2026-06-03","n1":46,"n2":28,"n3":42,"n4":31,"n5":23,"n6":34,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"154","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"}]}},{"issue":"2026155","year":2026,"date":"2026-06-04","n1":21,"n2":37,"n3":46,"n4":13,"n5":40,"n6":47,"special":7,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"155","balls":[{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":7,"zodiac":"鼠","element":"土","color":"红"}]}},{"issue":"2026156","year":2026,"date":"2026-06-05","n1":31,"n2":16,"n3":11,"n4":3,"n5":37,"n6":12,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"156","balls":[{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026157","year":2026,"date":"2026-06-06","n1":43,"n2":25,"n3":11,"n4":31,"n5":17,"n6":10,"special":40,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"157","balls":[{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":40,"zodiac":"兔","element":"火","color":"红"}]}},{"issue":"2026158","year":2026,"date":"2026-06-07","n1":43,"n2":48,"n3":3,"n4":1,"n5":12,"n6":23,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"158","balls":[{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026159","year":2026,"date":"2026-06-08","n1":12,"n2":4,"n3":28,"n4":17,"n5":20,"n6":46,"special":39,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"159","balls":[{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"}]}},{"issue":"2026160","year":2026,"date":"2026-06-09","n1":8,"n2":16,"n3":26,"n4":1,"n5":29,"n6":30,"special":2,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"160","balls":[{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"}]}},{"issue":"2026161","year":2026,"date":"2026-06-10","n1":36,"n2":40,"n3":42,"n4":19,"n5":34,"n6":46,"special":8,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"161","balls":[{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"}]}},{"issue":"2026162","year":2026,"date":"2026-06-11","n1":23,"n2":41,"n3":24,"n4":26,"n5":33,"n6":7,"special":32,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"162","balls":[{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":32,"zodiac":"猪","element":"火","color":"绿"}]}},{"issue":"2026163","year":2026,"date":"2026-06-12","n1":39,"n2":8,"n3":10,"n4":33,"n5":7,"n6":41,"special":37,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"163","balls":[{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"}]}},{"issue":"2026164","year":2026,"date":"2026-06-13","n1":46,"n2":4,"n3":38,"n4":12,"n5":3,"n6":2,"special":21,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"164","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"}]}},{"issue":"2026165","year":2026,"date":"2026-06-14","n1":11,"n2":47,"n3":9,"n4":49,"n5":2,"n6":1,"special":3,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"165","balls":[{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"}]}},{"issue":"2026166","year":2026,"date":"2026-06-15","n1":20,"n2":15,"n3":1,"n4":4,"n5":21,"n6":28,"special":6,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"166","balls":[{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":4,"zodiac":"兔","element":"金","color":"蓝"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"}]}},{"issue":"2026167","year":2026,"date":"2026-06-16","n1":23,"n2":3,"n3":40,"n4":39,"n5":7,"n6":11,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"167","balls":[{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"}]}},{"issue":"2026168","year":2026,"date":"2026-06-17","n1":27,"n2":11,"n3":24,"n4":5,"n5":40,"n6":33,"special":15,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"168","balls":[{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":33,"zodiac":"狗","element":"火","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"}]}},{"issue":"2026169","year":2026,"date":"2026-06-18","n1":44,"n2":37,"n3":30,"n4":8,"n5":40,"n6":22,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"169","balls":[{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026170","year":2026,"date":"2026-06-19","n1":27,"n2":46,"n3":6,"n4":38,"n5":20,"n6":34,"special":3,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"170","balls":[{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"}]}},{"issue":"2026171","year":2026,"date":"2026-06-20","n1":24,"n2":38,"n3":40,"n4":31,"n5":42,"n6":46,"special":28,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"171","balls":[{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"}]}},{"issue":"2026172","year":2026,"date":"2026-06-21","n1":28,"n2":34,"n3":42,"n4":37,"n5":45,"n6":8,"special":44,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"172","balls":[{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"}]}},{"issue":"2026173","year":2026,"date":"2026-06-22","n1":39,"n2":6,"n3":16,"n4":40,"n5":13,"n6":19,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"173","balls":[{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":16,"zodiac":"兔","element":"木","color":"绿"},{"number":40,"zodiac":"兔","element":"火","color":"红"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"}]}},{"issue":"2026174","year":2026,"date":"2026-06-23","n1":15,"n2":8,"n3":34,"n4":13,"n5":28,"n6":21,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"174","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":8,"zodiac":"猪","element":"木","color":"红"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":13,"zodiac":"马","element":"金","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"}]}},{"issue":"2026175","year":2026,"date":"2026-06-24","n1":7,"n2":19,"n3":30,"n4":29,"n5":28,"n6":25,"special":26,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"175","balls":[{"number":7,"zodiac":"鼠","element":"土","color":"红"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":28,"zodiac":"兔","element":"土","color":"绿"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"}]}},{"issue":"2026176","year":2026,"date":"2026-06-25","n1":30,"n2":31,"n3":2,"n4":36,"n5":38,"n6":15,"special":10,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"176","balls":[{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"}]}},{"issue":"2026177","year":2026,"date":"2026-06-26","n1":19,"n2":21,"n3":5,"n4":1,"n5":2,"n6":44,"special":14,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"177","balls":[{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":2,"zodiac":"蛇","element":"火","color":"红"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"}]}},{"issue":"2026178","year":2026,"date":"2026-06-27","n1":26,"n2":46,"n3":22,"n4":44,"n5":31,"n6":17,"special":18,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"178","balls":[{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":18,"zodiac":"牛","element":"火","color":"红"}]}},{"issue":"2026179","year":2026,"date":"2026-06-28","n1":10,"n2":11,"n3":26,"n4":6,"n5":31,"n6":9,"special":15,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"179","balls":[{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":26,"zodiac":"蛇","element":"金","color":"蓝"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":31,"zodiac":"鼠","element":"水","color":"蓝"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"}]}},{"issue":"2026180","year":2026,"date":"2026-06-29","n1":14,"n2":10,"n3":37,"n4":30,"n5":49,"n6":19,"special":21,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"180","balls":[{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":49,"zodiac":"马","element":"火","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":21,"zodiac":"狗","element":"土","color":"绿"}]}},{"issue":"2026181","year":2026,"date":"2026-06-30","n1":17,"n2":29,"n3":6,"n4":34,"n5":47,"n6":15,"special":19,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"181","balls":[{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":6,"zodiac":"牛","element":"土","color":"绿"},{"number":34,"zodiac":"鸡","element":"金","color":"红"},{"number":47,"zodiac":"猴","element":"木","color":"蓝"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"}]}},{"issue":"2026182","year":2026,"date":"2026-07-01","n1":15,"n2":23,"n3":9,"n4":45,"n5":24,"n6":39,"special":41,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"182","balls":[{"number":15,"zodiac":"龙","element":"水","color":"蓝"},{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":39,"zodiac":"龙","element":"木","color":"绿"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"}]}},{"issue":"2026183","year":2026,"date":"2026-07-02","n1":23,"n2":9,"n3":46,"n4":37,"n5":42,"n6":3,"special":24,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"183","balls":[{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":42,"zodiac":"牛","element":"金","color":"蓝"},{"number":3,"zodiac":"龙","element":"火","color":"蓝"},{"number":24,"zodiac":"羊","element":"木","color":"红"}]}},{"issue":"2026184","year":2026,"date":"2026-07-03","n1":44,"n2":24,"n3":11,"n4":36,"n5":25,"n6":20,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"184","balls":[{"number":44,"zodiac":"猪","element":"水","color":"绿"},{"number":24,"zodiac":"羊","element":"木","color":"红"},{"number":11,"zodiac":"猴","element":"火","color":"绿"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":25,"zodiac":"马","element":"木","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026185","year":2026,"date":"2026-07-04","n1":18,"n2":35,"n3":9,"n4":41,"n5":12,"n6":30,"special":36,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"185","balls":[{"number":18,"zodiac":"牛","element":"火","color":"红"},{"number":35,"zodiac":"猴","element":"金","color":"红"},{"number":9,"zodiac":"狗","element":"木","color":"蓝"},{"number":41,"zodiac":"虎","element":"火","color":"蓝"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":30,"zodiac":"牛","element":"水","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"}]}},{"issue":"2026186","year":2026,"date":"2026-07-05","n1":17,"n2":29,"n3":22,"n4":1,"n5":5,"n6":38,"special":23,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"186","balls":[{"number":17,"zodiac":"虎","element":"木","color":"绿"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":23,"zodiac":"猴","element":"水","color":"红"}]}},{"issue":"2026187","year":2026,"date":"2026-07-06","n1":23,"n2":12,"n3":36,"n4":38,"n5":27,"n6":22,"special":1,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"187","balls":[{"number":23,"zodiac":"猴","element":"水","color":"红"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":36,"zodiac":"羊","element":"土","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":27,"zodiac":"龙","element":"金","color":"绿"},{"number":22,"zodiac":"鸡","element":"水","color":"绿"},{"number":1,"zodiac":"马","element":"水","color":"红"}]}},{"issue":"2026188","year":2026,"date":"2026-07-07","n1":38,"n2":5,"n3":19,"n4":10,"n5":14,"n6":1,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"188","balls":[{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":5,"zodiac":"虎","element":"金","color":"绿"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":10,"zodiac":"鸡","element":"火","color":"蓝"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":1,"zodiac":"马","element":"水","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}},{"issue":"2026189","year":2026,"date":"2026-07-08","n1":45,"n2":12,"n3":37,"n4":20,"n5":38,"n6":43,"special":15,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"189","balls":[{"number":45,"zodiac":"狗","element":"水","color":"红"},{"number":12,"zodiac":"羊","element":"金","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":20,"zodiac":"猪","element":"土","color":"蓝"},{"number":38,"zodiac":"蛇","element":"木","color":"绿"},{"number":43,"zodiac":"鼠","element":"金","color":"绿"},{"number":15,"zodiac":"龙","element":"水","color":"蓝"}]}},{"issue":"2026190","year":2026,"date":"2026-07-09","n1":46,"n2":14,"n3":19,"n4":37,"n5":48,"n6":29,"special":16,"sourceUrl":"https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html","rawAttributes":{"pageIssue":"190","balls":[{"number":46,"zodiac":"鸡","element":"木","color":"红"},{"number":14,"zodiac":"蛇","element":"水","color":"蓝"},{"number":19,"zodiac":"鼠","element":"火","color":"红"},{"number":37,"zodiac":"马","element":"土","color":"蓝"},{"number":48,"zodiac":"羊","element":"火","color":"蓝"},{"number":29,"zodiac":"虎","element":"土","color":"红"},{"number":16,"zodiac":"兔","element":"木","color":"绿"}]}}]');
;// ./data/sample-rules.json
const sample_rules_namespaceObject = /*#__PURE__*/JSON.parse('[{"id":"rq-kill-zodiac-l-core","name":"L序杀一肖 - 样例核心","category":"kill_zodiac","orderMode":"L","formula":"平1 + 平2 + 特码尾 + 总数尾 + 59","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","样例"],"description":"首版手工整理规则，用于验证 115 - 48 - 48 = 19 = 鼠 的杀肖链路。","sourceFile":"杀一肖规，共10条.txt","examples":["115 - 48 - 48 = 19 = 鼠"],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-sum-l-core","name":"L序杀一合 - 样例核心","category":"kill_sum","orderMode":"L","formula":"平1 + 平3 + 特码合 + 期尾","normalizer":"subtract_13_to_1_13","target":"special_sum","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀合"],"description":"来自 L序杀合数规则文件的首版结构化规则，使用减 13 归一。","sourceFile":"一条L序杀合数规.txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-tail-d-core","name":"D序杀一尾 - 试算规则","category":"kill_tail","orderMode":"D","formula":"平1 + 平4 + 特码尾 + 总数尾","normalizer":"mod_10","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["D序","杀尾"],"description":"用于跑通 D序变量、尾数归一和下一期特码尾验证。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-head-l-core","name":"L序杀一头 - 样例核心","category":"kill_head","orderMode":"L","formula":"头(平1) + 头(平2) + 特码头 + 期尾","normalizer":"subtract_5_to_0_4","target":"special_head","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀头"],"description":"用于验证头数变量和减 5 归一。","sourceFile":"L序杀一头规.txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-element-l-core","name":"L序杀一行 - 样例核心","category":"kill_element","orderMode":"L","formula":"行(平1) + 行(平2) + 特码行 + 期尾","normalizer":"subtract_5_to_1_5","target":"special_element","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","五行"],"description":"用于验证五行值同义词：行 = 五行值。","sourceFile":"L序杀一行规公式.txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-segment-macau","name":"澳门杀一段 - 样例核心","category":"kill_segment","orderMode":"L","formula":"段(平1) + 段(平2) + 特码段 + 期尾","normalizer":"subtract_7_to_1_7","target":"special_segment","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀段"],"description":"用于验证段位和杀段回测。","sourceFile":"澳门杀一段规，要的拿走。.txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-seven-tail-core","name":"七尾 - 偏移集合","category":"seven_tail","orderMode":"L","formula":"特码尾","normalizer":"tail_offsets","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["七尾","集合"],"description":"baseTail 使用 [-3,-2,-1,0,+1,+2,+4] 生成七尾集合。","sourceFile":"澳门规：.txt","examples":["baseTail=9 -> 6,7,8,9,0,1,3"],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-odd-even-4455-core","name":"单双自用 - 取值4455","category":"include_parity","orderMode":"L","formula":"平4","normalizer":"parity_4455_plus_1_or_2","target":"special_parity","verifyMode":"next_special","positionPattern":[4,4,5,5],"anchorIssue":"2026172","anchorPatternIndex":0,"positionMeaning":"取值4455循环：平4时 +1 后取单双，平5时 +2 后取单双；1=平1，2=平2，3=平3，4=平4，5=平5，6=平6，7=特码","periodSpan":1,"enabled":true,"participatesInReference":true,"sourceType":"user_provided","tags":["单双","取值4455","用户提供"],"description":"来自“单双自用、、20260625、、取值4455(1).txt”。按期号循环取平4/平5：平4加1后看单双，平5加2后看单双，用下一期特码单双验证。","sourceFile":"单双自用、、20260625、、取值4455(1).txt","examples":["175期 平5兔28 + 2 = 30 双，176期鸡10为双","174期 平5兔28 + 2 = 30 双，175期蛇26为双，正确","173期 平4兔40 + 1 = 41 单，174期虎41为单，正确"],"createdAt":"2026-06-26T00:00:00.000Z","updatedAt":"2026-06-26T00:00:00.000Z"},{"id":"rq-eight-zodiac-core","name":"八肖 - 123456.5432","category":"eight_zodiac","orderMode":"L","formula":"平1","normalizer":"eight_zodiac","target":"special_zodiac","verifyMode":"next_special","positionPattern":[1,2,3,4,5,6,5,4,3,2],"anchorIssue":"2026169","anchorPatternIndex":0,"positionMeaning":"1=平1，2=平2，3=平3，4=平4，5=平5，6=平6，7=特码","periodSpan":1,"enabled":true,"tags":["八肖","集合"],"description":"按平位号码 +1 取起点生肖，再生成八肖集合。","sourceFile":"八肖自用、、(2个括号内的肖都是括号前的肖的对冲+123456。取值123.txt","examples":["13马 +1 = 14蛇 -> 蛇、龙、兔、鸡、虎、牛、羊、鼠"],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-eight-zodiac-two-period","name":"八肖管两期 - 平6中心","category":"eight_zodiac_two_period","orderMode":"L","formula":"平6","normalizer":"eight_zodiac_two_period","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":2,"enabled":true,"tags":["八肖","管两期"],"description":"取平6生肖，前3、本肖、后3、对冲，验证后两期。","sourceFile":"八肖管理两期(此规管2期的。).txt","examples":["狗 -> 牛、鼠、猪、狗、鸡、猴、羊、龙"],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-kill-three-as-nine","name":"杀三肖 / 九肖 - 7654321.23456","category":"kill_three_as_nine","orderMode":"L","formula":"平7","normalizer":"kill_three_as_nine","target":"special_zodiac","verifyMode":"next_special","positionPattern":[7,6,5,4,3,2,1,2,3,4,5,6],"anchorIssue":"2026167","anchorPatternIndex":0,"positionMeaning":"1=平1，2=平2，3=平3，4=平4，5=平5，6=平6，7=特码","periodSpan":1,"enabled":true,"tags":["杀三肖","九肖"],"description":"取指定平位生肖 A，杀 A、A 下一个、下一个的对冲；九肖为其余生肖。","sourceFile":"杀三肖可以当做九肖用、、20260606、、(取值平7654321.23456.7654321.23456.).txt","examples":[],"createdAt":"2026-06-24T00:00:00.000Z","updatedAt":"2026-06-24T00:00:00.000Z"},{"id":"rq-raw-d-kill-zodiac-327","name":"D序杀一肖 - 327期错8","category":"kill_zodiac","orderMode":"D","formula":"平5合尾 + 平4头 + 平6合 + 平4 + 平6 + 9","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["D序","杀肖","原始公式"],"description":"从 D序杀一肖原始文件整理，直接按今年网站全年开奖逐期回测。","sourceFile":"D序，杀一肖（截止163期，327错8）.txt","examples":["平5合尾+平4头+平6合+平4+平6+9"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-d-kill-zodiac-rule1","name":"D序杀规1 - 平2头平3波","category":"kill_zodiac","orderMode":"D","formula":"平2头 + 平3波 + 平4波 + 特行值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["D序","杀肖","原始公式"],"description":"从 D序杀规1 原文整理，支持原文变量后缀写法。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":["平2头+平3波+平4波+特行值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-rule1","name":"L序杀规1 - 平2头平3波","category":"kill_zodiac","orderMode":"L","formula":"平2头 + 平3波 + 平4波 + 特行值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"同一公式按 L序口径回测，便于和 D序对照。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":["平2头+平3波+平4波+特行值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-rule5","name":"L序杀规5 - 平1合平2段","category":"kill_zodiac","orderMode":"L","formula":"6 + 平1合 + 平2段 + 平4合 + 平6波","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"从 L序杀规5 原文整理。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":["6+平1合+平2段+平4合+平6波"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-rule10","name":"L序杀规10 - 总数尾","category":"kill_zodiac","orderMode":"L","formula":"4 + 平1段 + 平3波 + 平3行 + 平6合 + 平6波 + 特码波 + 总数尾","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"从 L序杀规10 原文整理，总数尾为七个开奖号总和尾数。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":["4+平1段+平3波+平3行+平6合+平6波+特码波+总数尾"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-rule4","name":"L序杀规4 - 平1合平3头","category":"kill_zodiac","orderMode":"L","formula":"9 + 平1合 + 平3头 + 平5头","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"从 L序杀规4 原文整理。","sourceFile":"D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt","examples":["9+平1合+平3头+平5头"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-7","name":"L序杀一肖规7","category":"kill_zodiac","orderMode":"L","formula":"5 + 平2合 + 平3行 + 平5头 + 特合","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"从 L序杀肖一肖规7 原文整理。","sourceFile":"L序杀肖一肖规7(1).txt","examples":["5+平2合+平3行+平5头+特合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-zodiac-8","name":"L序杀一肖规8","category":"kill_zodiac","orderMode":"L","formula":"7 + 平2合 + 平3行 + 平5头 + 特合","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀肖","原始公式"],"description":"从 L序杀肖一肖规8 原文整理。","sourceFile":"L序杀肖一肖规8.txt","examples":["7+平2合+平3行+平5头+特合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-head","name":"L序杀一头 - 原始公式","category":"kill_head","orderMode":"L","formula":"平3波 + 平4行 + 平5波 + 平5合 + 特码行 + 特码 + 总数合","normalizer":"subtract_5_to_0_4","target":"special_head","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀头","原始公式"],"description":"从 L序杀一头规原文整理。","sourceFile":"L序杀一头规.txt","examples":["平3波+平4行+平5波+平5合+特码行+特码+总数合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-element","name":"L序杀一行 - 原始公式","category":"kill_element","orderMode":"L","formula":"平1尾 + 平1段 + 平4尾 + 平5合 + 平5五行值 + 总数合","normalizer":"subtract_5_to_1_5","target":"special_element","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","五行","原始公式"],"description":"从 L序杀一行规公式原文整理。","sourceFile":"L序杀一行规公式.txt","examples":["平1尾+平1段+平4尾+平5合+平5五行值+总数合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-l-kill-sum","name":"L序杀一合规7 - 原始公式","category":"kill_sum","orderMode":"L","formula":"8 + 平1合 + 平4码","normalizer":"subtract_13_to_1_13","target":"special_sum","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["L序","杀合","原始公式"],"description":"从 L序杀合数规原文整理。","sourceFile":"一条L序杀合数规.txt","examples":["8+平1合+平4码"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-sum-1","name":"澳门杀一合 - 7平1段平2段","category":"kill_sum","orderMode":"D","formula":"7 + 平1段 + 平2段 + 平6头","normalizer":"subtract_13_to_1_13","target":"special_sum","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀合","原始公式"],"description":"从澳门规原文整理。","sourceFile":"澳门规：.txt","examples":["7+平1段+平2段+平6头"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-sum-2","name":"澳门杀一合 - 五行头合","category":"kill_sum","orderMode":"D","formula":"8 + 平2五行值 + 平4头 + 平4五行值 + 平6合","normalizer":"subtract_13_to_1_13","target":"special_sum","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀合","原始公式"],"description":"从澳门规原文整理。","sourceFile":"澳门规：.txt","examples":["8+平2五行值+平4头+平4五行值+平6合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-sum-3","name":"澳门杀一合 - 12平2头波","category":"kill_sum","orderMode":"D","formula":"12 + 平2头 + 平2波色值","normalizer":"subtract_13_to_1_13","target":"special_sum","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀合","原始公式"],"description":"从澳门规原文整理。","sourceFile":"澳门规：.txt","examples":["12+平2头+平2波色值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-tail-1","name":"澳门杀一尾 - 平3头波平4行","category":"kill_tail","orderMode":"D","formula":"6 + 平3头 + 平3波色值 + 平4五行值 + 平6尾 + 期数尾","normalizer":"mod_10","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀尾","原始公式"],"description":"从澳门规原文整理。","sourceFile":"澳门规：.txt","examples":["6+平3头+平3波色值+平4五行值+平6尾+期数尾"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-tail-2","name":"澳门杀一尾 - 特码段总数尾","category":"kill_tail","orderMode":"D","formula":"4 + 平3五行值 + 平4头 + 特码段 + 总数尾 + 期数尾","normalizer":"mod_10","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀尾","原始公式"],"description":"从澳门规原文整理，总数尾为七个落球相加总和尾数。","sourceFile":"澳门规：.txt","examples":["4+平3五行值+平4头+特码段+总数尾+期数尾"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-zodiac-1","name":"澳门杀一肖 - 特码波色值","category":"kill_zodiac","orderMode":"L","formula":"4 + 平3尾 + 平5五行值 + 平6头 + 平6段 + 特码 + 特码波色值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","原始公式"],"description":"从澳门规原文整理。","sourceFile":"澳门规：.txt","examples":["4+平3尾+平5五行值+平6头+平6段+特码+特码波色值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-zodiac-2-l","name":"澳门杀一肖 - L序平4行平6尾","category":"kill_zodiac","orderMode":"L","formula":"5 + 平4五行值 + 平6尾 + 平6波色值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","原始公式"],"description":"从澳门规原文整理，L序口径。","sourceFile":"澳门规：.txt","examples":["5+平4五行值+平6尾+平6波色值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-zodiac-2-d","name":"澳门杀一肖 - D序平4行平6尾","category":"kill_zodiac","orderMode":"D","formula":"5 + 平4五行值 + 平6尾 + 平6波色值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","原始公式"],"description":"从澳门规原文整理，D序口径。","sourceFile":"澳门规：.txt","examples":["5+平4五行值+平6尾+平6波色值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-macau-kill-zodiac-image-line","name":"澳门杀一肖 - 图片同款明细公式","category":"kill_zodiac","orderMode":"L","formula":"2 + 平2五行值 + 平3 + 平4合 + 平5段 + 平6波色值","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","图片重点","原始公式"],"description":"从图片和澳门规中重点公式整理，用于生成 172期2+1+42+10+7+0=62蛇 这种逐期流水账。","sourceFile":"澳门规：.txt","examples":["2+平2五行值+平3+平4合+平5段+平6波色值"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-seven-tail-macau","name":"澳门七尾 - 平1尾平2段","category":"seven_tail","orderMode":"L","formula":"平1尾 + 平2段 + 平2五行值 + 平5合","normalizer":"tail_offsets","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["七尾","澳门","原始公式"],"description":"从澳门规七尾示例整理，使用系统七尾偏移数组生成尾数组合。","sourceFile":"澳门规：.txt","examples":["平1尾+平2段+平2五行值+平5合"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-macau-kill-zodiac-6","name":"澳门杀一肖10条 - 规6","category":"kill_zodiac","orderMode":"D","formula":"平1尾 + 平4合 + 期合 + 平1合尾 + 平3合尾 + 8","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","10条","原始公式"],"description":"从澳门杀一肖规10条中规6整理。","sourceFile":"澳门杀一肖规，共10条.txt","examples":["平1尾+平4合+期合+平1合尾+平3合尾+8"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-macau-kill-zodiac-7","name":"澳门杀一肖10条 - 规7","category":"kill_zodiac","orderMode":"L","formula":"落6行 + 落2波 + 特尾 + 特号 + 特合尾 + 1","normalizer":"subtract_48_to_1_49","target":"special_zodiac","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"tags":["澳门","杀肖","10条","原始公式"],"description":"从澳门杀一肖规10条中规7整理。","sourceFile":"澳门杀一肖规，共10条.txt","examples":["落6行+落2波+特尾+特号+特合尾+1"],"createdAt":"2026-06-25T00:00:00.000Z","updatedAt":"2026-06-25T00:00:00.000Z"},{"id":"rq-raw-seven-tail-macau-2","name":"澳门七尾规公式2","category":"seven_tail","orderMode":"L","formula":"平1尾 + 平2段 + 平2五行值 + 平5合","normalizer":"tail_offsets","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"participatesInReference":true,"sourceType":"user_provided","tags":["七尾","澳门","用户提供"],"description":"来自“澳门七尾规公式2：.txt”。计算定位尾后按 -3、-2、-1、+0、+1、+2、+4 闭环生成七尾。","sourceFile":"澳门七尾规公式2：.txt","examples":["172期8+5+1+9=23，0123457尾，173开蛇26错"],"createdAt":"2026-06-27T00:00:00.000Z","updatedAt":"2026-06-27T00:00:00.000Z"},{"id":"rq-seven-tail-d-161","name":"D序七尾新规 - 定位8样例","category":"seven_tail","orderMode":"D","formula":"平1尾 + 平5段 + 特码尾","normalizer":"tail_offsets:-4,-3,-1,1,3,4,5","target":"special_tail","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"participatesInReference":true,"sourceType":"user_provided","tags":["七尾","D序","用户提供"],"description":"D序先计算定位尾，再按 -4、-3、-1、+1、+3、+4、+5 做0-9闭环生成七尾。","sourceFile":"用户补充七尾规（161期定位8）","examples":["161期定位尾数8 -> 4、5、7、9、1、2、3"],"createdAt":"2026-07-10T00:00:00.000Z","updatedAt":"2026-07-10T00:00:00.000Z"},{"id":"rq-kill-element-d-user","name":"D序杀一行 - 尾合五行值","category":"kill_element","orderMode":"D","formula":"平2尾 + 平3尾 + 特码合 + 特码五行值","normalizer":"subtract_5_to_1_5","target":"special_element","verifyMode":"next_special","positionPattern":[],"periodSpan":1,"enabled":true,"participatesInReference":true,"sourceType":"user_provided","tags":["杀一行","D序","用户提供"],"description":"D序取平2尾、平3尾、特码合和特码五行值，结果循环减5映射到金木水火土。","sourceFile":"用户补充D序杀一行","examples":[],"createdAt":"2026-07-10T00:00:00.000Z","updatedAt":"2026-07-10T00:00:00.000Z"},{"id":"rq-nine-zodiac-three-clash","name":"九肖自用 - 123456.5432","category":"nine_zodiac","orderMode":"L","formula":"平1","normalizer":"nine_zodiac_plus_1_three_clash","target":"special_zodiac","verifyMode":"next_special","positionPattern":[1,2,3,4,5,6,5,4,3,2,1,2,3,4,5,6,5,4,3,2],"anchorIssue":"2026139","anchorPatternIndex":0,"positionMeaning":"取值123456.5432.123456.5432；先取平位号码 +1 得起点生肖，九肖=起点、起点对冲、+1、+2、+2对冲、+3、+4、+4对冲、+5。","periodSpan":1,"enabled":true,"participatesInReference":true,"sourceType":"user_provided","tags":["九肖","用户提供","取位循环"],"description":"来自“九肖自用、、(3个括号内的肖都是括号前的肖的对冲+123456。取值123.txt”。括号内三肖分别为起点、+2、+4 的对冲肖。","sourceFile":"九肖自用、、(3个括号内的肖都是括号前的肖的对冲+123456。取值123.txt","examples":["175平5兔28+1=29虎(猴)牛鼠(马)猪狗(龙)鸡"],"createdAt":"2026-06-27T00:00:00.000Z","updatedAt":"2026-06-27T00:00:00.000Z"}]');
;// ./src/lib/data/seed.ts



const seedDraws = sample_draws_namespaceObject;
const seedRules = sample_rules_namespaceObject;
const seedConfig = defaultConfig;
const seedSampleCases = [
    {
        id: "sample-kill-zodiac-pass",
        ruleId: "rq-kill-zodiac-l-core",
        issue: "2026151",
        expectedRawResult: 115,
        expectedFinalResult: 19,
        expectedMappedResult: [
            "鼠"
        ],
        expectedSuccess: true,
        sourceFile: "杀一肖规，共10条.txt",
        note: "确认 115 - 48 - 48 = 19 = 鼠 的计算链路。"
    },
    {
        id: "sample-image-172-kill-snake",
        ruleId: "rq-macau-kill-zodiac-image-line",
        issue: "2026172",
        expectedRawResult: 62,
        expectedFinalResult: 14,
        expectedMappedResult: [
            "蛇"
        ],
        expectedSuccess: false,
        sourceFile: "90671526093700bbb4e170db89f28d3f.jpg",
        note: "图片手算：172期 2 + 1 + 42 + 10 + 7 + 0 = 62；62 对应蛇；173期开蛇26，所以杀蛇为错误。"
    },
    {
        id: "sample-eight-zodiac-173",
        ruleId: "rq-eight-zodiac-core",
        issue: "2026173",
        expectedRawResult: 13,
        expectedMappedResult: [
            "蛇",
            "龙",
            "兔",
            "鸡",
            "虎",
            "牛",
            "羊",
            "鼠"
        ],
        expectedSuccess: true,
        sourceFile: "八肖自用、、(2个括号内的肖都是括号前的肖的对冲+123456。取值123.txt",
        note: "TXT 手算：173 平5 马13 + 1 = 14 蛇，八肖集合含虎，174 开虎41，正确。"
    },
    {
        id: "sample-kill-three-173",
        ruleId: "rq-kill-three-as-nine",
        issue: "2026173",
        expectedRawResult: 39,
        expectedSuccess: true,
        sourceFile: "杀三肖可以当做九肖用、、20260606、、(取值平7654321.23456.7654321.23456.).txt",
        note: "TXT 手算：173 平1 龙39，杀龙、兔、鸡；174 开虎41，九肖候选命中。"
    }
];

;// ./src/lib/rules/rule-reconciliation.ts

function buildRuleReconciliation(input) {
    const validationMap = new Map(input.validationSummaries.map((summary)=>[
            summary.ruleId,
            summary
        ]));
    const allSourceFiles = [
        ...new Set([
            ...input.sourceFiles,
            ...input.rules.map((rule)=>rule.sourceFile).filter(Boolean)
        ])
    ];
    return allSourceFiles.map((sourceFile)=>{
        const fileRules = input.rules.filter((rule)=>rule.sourceFile === sourceFile);
        const summaries = fileRules.map((rule)=>validationMap.get(rule.id)).filter((item)=>Boolean(item));
        const pendingConfirmationCount = summaries.filter((summary)=>summary.status === "unchecked").length;
        const mismatchCount = summaries.filter((summary)=>summary.status === "mismatch").length;
        const passedCount = summaries.filter((summary)=>summary.status === "checked").length;
        const participatingCount = fileRules.filter((rule)=>canRuleParticipateInReference(rule, validationMap.get(rule.id))).length;
        return {
            sourceFile,
            recognizedCount: fileRules.length,
            enteredLibraryCount: fileRules.length,
            failedRecognitionCount: fileRules.length ? 0 : 1,
            pendingConfirmationCount,
            passedCount,
            mismatchCount,
            participatingCount,
            ruleIds: fileRules.map((rule)=>rule.id),
            ruleNames: fileRules.map((rule)=>rule.name),
            failedReason: fileRules.length ? undefined : "该 TXT 暂未识别出可计算公式，需要人工补录或补充样例。"
        };
    });
}

;// ./src/lib/rules/rule-library.ts
function compact(value) {
    return String(value ?? "").trim();
}
function nextRuleId(sourceType, now) {
    const prefix = sourceType === "system_recommended" ? "rule-system" : sourceType === "txt_import" ? "rule-txt" : sourceType === "copied" ? "rule-copy" : "rule";
    return `${prefix}-${Date.parse(now) || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function normalizedPattern(pattern) {
    return (pattern ?? []).map(Number).filter((item)=>Number.isFinite(item));
}
function buildRuleSignature(rule) {
    return [
        rule.category,
        rule.target,
        rule.orderMode,
        compact(rule.formula).replace(/\s+/g, ""),
        compact(rule.normalizer),
        normalizedPattern(rule.positionPattern).join(","),
        String(rule.verifyOffset ?? 1)
    ].join("|");
}
function normalizeRuleDraft(draft, options = {}) {
    const now = options.now ?? new Date().toISOString();
    const sourceType = draft.sourceType ?? options.existingRule?.sourceType ?? "manual";
    const id = options.forceNewId || !draft.id ? nextRuleId(sourceType, now) : draft.id;
    const rule = {
        id,
        name: compact(draft.name) || "未命名规则",
        category: draft.category ?? options.existingRule?.category ?? "kill_zodiac",
        orderMode: draft.orderMode ?? options.existingRule?.orderMode ?? "L",
        formula: compact(draft.formula) || options.existingRule?.formula || "平1",
        normalizer: compact(draft.normalizer) || options.existingRule?.normalizer || "auto",
        target: compact(draft.target) || options.existingRule?.target || "special",
        verifyMode: "next_special",
        positionPattern: normalizedPattern(draft.positionPattern ?? options.existingRule?.positionPattern),
        anchorIssue: draft.anchorIssue ?? options.existingRule?.anchorIssue,
        anchorPatternIndex: draft.anchorPatternIndex ?? options.existingRule?.anchorPatternIndex,
        positionMeaning: draft.positionMeaning ?? options.existingRule?.positionMeaning,
        periodSpan: Number(draft.periodSpan ?? options.existingRule?.periodSpan ?? 1) || 1,
        verifyOffset: Number(draft.verifyOffset ?? options.existingRule?.verifyOffset ?? draft.periodSpan ?? options.existingRule?.periodSpan ?? 1) || 1,
        enabled: draft.enabled ?? options.existingRule?.enabled ?? true,
        manuallyConfirmed: draft.manuallyConfirmed ?? options.existingRule?.manuallyConfirmed ?? false,
        participatesInReference: draft.participatesInReference ?? options.existingRule?.participatesInReference ?? true,
        sourceType,
        origin: draft.origin ?? options.existingRule?.origin,
        canCompute: draft.canCompute ?? options.existingRule?.canCompute,
        parseStatus: draft.parseStatus ?? options.existingRule?.parseStatus ?? "parsed",
        verifyStatus: draft.verifyStatus ?? options.existingRule?.verifyStatus ?? "unchecked",
        tags: draft.tags ?? options.existingRule?.tags ?? [],
        description: draft.description ?? options.existingRule?.description ?? "",
        sourceFile: draft.sourceFile ?? options.existingRule?.sourceFile ?? "",
        examples: draft.examples ?? options.existingRule?.examples ?? [],
        createdAt: options.existingRule && !options.forceNewId ? options.existingRule.createdAt : draft.createdAt ?? now,
        updatedAt: now,
        fromCandidateId: draft.fromCandidateId ?? options.existingRule?.fromCandidateId,
        fromTextId: draft.fromTextId ?? options.existingRule?.fromTextId
    };
    return {
        ...rule,
        librarySignature: buildRuleSignature(rule)
    };
}
function validateRuleForLibrary(rule) {
    const errors = [];
    if (!compact(rule.name)) errors.push("缺少规则名称");
    if (!rule.category) errors.push("缺少规则类型");
    if (!rule.orderMode) errors.push("缺少 L序 / D序");
    if (!compact(rule.formula)) errors.push("缺少公式内容");
    if (!compact(rule.normalizer)) errors.push("缺少归一化方式");
    if (!compact(rule.target)) errors.push("缺少目标类型");
    if (rule.parseStatus === "failed") errors.push("规则解析失败");
    return errors;
}
function addRuleToLibrary(input) {
    const now = input.now ?? new Date().toISOString();
    const existingRule = input.mode === "update" && input.draft.id ? input.existingRules.find((rule)=>rule.id === input.draft.id) : undefined;
    const rule = normalizeRuleDraft(input.draft, {
        now,
        existingRule,
        forceNewId: input.mode !== "update"
    });
    const errors = validateRuleForLibrary(rule);
    if (errors.length) {
        return {
            ok: false,
            rules: input.existingRules,
            reason: errors.join("；"),
            errors,
            signature: rule.librarySignature
        };
    }
    const signature = rule.librarySignature ?? buildRuleSignature(rule);
    const duplicate = input.allowDuplicate ? undefined : input.existingRules.find((item)=>item.id !== rule.id && buildRuleSignature(item) === signature);
    if (duplicate) {
        return {
            ok: false,
            rules: input.existingRules,
            reason: "这条规则已存在于公式库",
            errors: [
                "重复规则"
            ],
            duplicate,
            signature
        };
    }
    const withoutCurrent = input.existingRules.filter((item)=>item.id !== rule.id);
    const rules = [
        rule,
        ...withoutCurrent
    ];
    return {
        ok: true,
        rule,
        rules,
        signature,
        message: input.mode === "update" && existingRule ? "规则已更新" : "规则已加入公式库"
    };
}
function addRulesToLibrary(existingRules, drafts, options = {}) {
    let rules = existingRules;
    const added = [];
    const duplicates = [];
    const failed = [];
    drafts.forEach((draft)=>{
        const result = addRuleToLibrary({
            existingRules: rules,
            draft,
            mode: "add",
            now: options.now
        });
        if (result.ok) {
            rules = result.rules;
            added.push(result.rule);
        } else if (result.duplicate) {
            duplicates.push(result.duplicate);
        } else {
            failed.push(result);
        }
    });
    return {
        rules,
        added,
        duplicates,
        failed
    };
}

;// ./src/lib/reference-history/reference-history.ts

function reference_history_padNumber(value) {
    return String(value).padStart(2, "0");
}
function sortDrawRecords(records) {
    return [
        ...records
    ].sort((a, b)=>{
        const aNumber = /^\d+$/.test(a.issue) ? Number(a.issue) : undefined;
        const bNumber = /^\d+$/.test(b.issue) ? Number(b.issue) : undefined;
        if (aNumber !== undefined && bNumber !== undefined) return aNumber - bNumber;
        if (aNumber !== undefined) return 1;
        if (bNumber !== undefined) return -1;
        return a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        });
    });
}
function stableHash(value) {
    let hash = 0;
    for(let index = 0; index < value.length; index += 1){
        hash = (hash << 5) - hash + value.charCodeAt(index) | 0;
    }
    return Math.abs(hash).toString(36);
}
function referenceHistorySignature(report) {
    return JSON.stringify({
        issue: report.latestIssue,
        latestNumbers: report.latestNumbers,
        ruleCount: report.ruleCount,
        signalCount: report.signalCount,
        top8: report.topNumbers8.map((item)=>item.number),
        top18: report.topNumbers18.map((item)=>item.number),
        z9: report.topZodiacs9.map((item)=>item.zodiac)
    });
}
function ruleNames(items) {
    return items.map((item)=>item.ruleName);
}
function compactCandidateEvidence(item) {
    return {
        ruleId: item.ruleId,
        ruleName: item.ruleName,
        category: item.category,
        action: item.action,
        targetType: item.targetType,
        targets: item.targets,
        weight: item.weight,
        scoreDelta: item.scoreDelta,
        successRate: item.successRate,
        recentRate: item.recentRate,
        currentStreak: item.currentStreak,
        wrongStreak: item.wrongStreak,
        formula: item.formula,
        process: item.process.slice(0, 8),
        sourceType: item.sourceType
    };
}
function compactHistoryNumber(item, rank) {
    return {
        rank,
        number: item.number,
        zodiac: item.zodiac,
        score: item.score,
        supportCount: item.supportCount,
        opposeCount: item.opposeCount,
        inTop8: rank <= 8,
        inTop12: rank <= 12,
        inTop16: rank <= 16,
        inTop18: rank <= 18,
        supportRuleNames: ruleNames(item.supportRules),
        opposeRuleNames: ruleNames(item.opposeRules),
        color: item.color,
        element: item.element,
        tail: item.tail,
        sum: item.sum,
        segment: item.segment,
        supportEvidence: item.supportRules.map(compactCandidateEvidence),
        opposeEvidence: item.opposeRules.map(compactCandidateEvidence)
    };
}
function compactHistoryZodiac(item, rank) {
    return {
        rank,
        zodiac: item.zodiac,
        score: item.score,
        numbers: item.numbers.map((number)=>({
                number: number.number,
                zodiac: number.zodiac
            })),
        supportCount: item.supportCount,
        opposeCount: item.opposeCount,
        inTop7: rank <= 7,
        inTop8: rank <= 8,
        inTop9: rank <= 9,
        supportRuleNames: ruleNames(item.supportRules),
        opposeRuleNames: ruleNames(item.opposeRules),
        supportEvidence: item.supportRules.map(compactCandidateEvidence),
        opposeEvidence: item.opposeRules.map(compactCandidateEvidence)
    };
}
function reference_history_evidenceFromSignal(signal) {
    return {
        ruleId: signal.ruleId,
        ruleName: signal.ruleName,
        category: signal.category,
        action: signal.action,
        targetType: signal.targetType,
        targets: signal.targets,
        weight: signal.weight,
        scoreDelta: signal.scoreDelta,
        successRate: signal.successRate,
        recentRate: signal.recentRate,
        currentStreak: signal.currentStreak,
        wrongStreak: signal.wrongStreak,
        formula: signal.formula,
        process: signal.process.slice(0, 8),
        sourceType: signal.sourceType
    };
}
function buildReferenceHistoryItem(input) {
    const signature = referenceHistorySignature(input.report);
    const savedAt = new Date().toISOString();
    const allNumbers = input.report.allNumbers.map((item, index)=>compactHistoryNumber(item, index + 1));
    const allZodiacs = input.report.allZodiacs.map((item, index)=>compactHistoryZodiac(item, index + 1));
    const byNumber = new Map(allNumbers.map((item)=>[
            item.number,
            item
        ]));
    const byZodiac = new Map(allZodiacs.map((item)=>[
            item.zodiac,
            item
        ]));
    return {
        schemaVersion: 2,
        id: `reference-${input.report.latestIssue ?? "unknown"}-${stableHash(signature)}`,
        signature,
        generatedAt: input.report.generatedAt,
        savedAt,
        saveType: input.saveType,
        baseIssue: input.report.latestIssue,
        targetIssue: input.report.latestIssue && /^\d+$/.test(input.report.latestIssue) ? String(Number(input.report.latestIssue) + 1) : undefined,
        latestDate: input.report.latestDate,
        latestNumbers: input.report.latestNumbers,
        dataSourceLabel: input.dataSourceLabel,
        recordCount: input.recordCount,
        ruleCount: input.report.ruleCount,
        signalCount: input.report.signalCount,
        supportSignalCount: input.report.signals.filter((signal)=>signal.action === "include").length,
        opposeSignalCount: input.report.signals.filter((signal)=>signal.action === "exclude").length,
        topNumbers8: input.report.topNumbers8.map((item)=>byNumber.get(item.number) ?? compactHistoryNumber(item, 999)),
        topNumbers12: input.report.topNumbers12.map((item)=>byNumber.get(item.number) ?? compactHistoryNumber(item, 999)),
        topNumbers16: input.report.topNumbers16.map((item)=>byNumber.get(item.number) ?? compactHistoryNumber(item, 999)),
        topNumbers18: input.report.topNumbers18.map((item)=>byNumber.get(item.number) ?? compactHistoryNumber(item, 999)),
        topZodiacs7: input.report.topZodiacs7.map((item)=>byZodiac.get(item.zodiac) ?? compactHistoryZodiac(item, 999)),
        topZodiacs8: input.report.topZodiacs8.map((item)=>byZodiac.get(item.zodiac) ?? compactHistoryZodiac(item, 999)),
        topZodiacs9: input.report.topZodiacs9.map((item)=>byZodiac.get(item.zodiac) ?? compactHistoryZodiac(item, 999)),
        allNumbers,
        allZodiacs,
        evidenceSummary: input.report.signals.slice(0, 120).map(reference_history_evidenceFromSignal),
        note: input.note
    };
}
function normalizeLegacyNumber(item, index) {
    const rank = item.rank ?? index + 1;
    return {
        rank,
        number: item.number ?? 0,
        zodiac: item.zodiac ?? "",
        score: item.score ?? 0,
        supportCount: item.supportCount ?? 0,
        opposeCount: item.opposeCount ?? 0,
        inTop8: item.inTop8 ?? rank <= 8,
        inTop12: item.inTop12 ?? rank <= 12,
        inTop16: item.inTop16 ?? rank <= 16,
        inTop18: item.inTop18 ?? rank <= 18,
        hit: item.hit,
        supportRuleNames: item.supportRuleNames ?? [],
        opposeRuleNames: item.opposeRuleNames ?? [],
        color: item.color,
        element: item.element,
        tail: item.tail,
        sum: item.sum,
        segment: item.segment,
        supportEvidence: item.supportEvidence ?? [],
        opposeEvidence: item.opposeEvidence ?? []
    };
}
function normalizeLegacyZodiac(item, index) {
    const rank = item.rank ?? index + 1;
    return {
        rank,
        zodiac: item.zodiac ?? "",
        score: item.score ?? 0,
        numbers: item.numbers ?? [],
        supportCount: item.supportCount ?? 0,
        opposeCount: item.opposeCount ?? 0,
        inTop7: item.inTop7 ?? rank <= 7,
        inTop8: item.inTop8 ?? rank <= 8,
        inTop9: item.inTop9 ?? rank <= 9,
        hit: item.hit,
        supportRuleNames: item.supportRuleNames ?? [],
        opposeRuleNames: item.opposeRuleNames ?? [],
        supportEvidence: item.supportEvidence ?? [],
        opposeEvidence: item.opposeEvidence ?? []
    };
}
function normalizedRecord(record) {
    const topNumbers18 = (record.topNumbers18 ?? []).map(normalizeLegacyNumber);
    const topZodiacs9 = (record.topZodiacs9 ?? []).map(normalizeLegacyZodiac);
    const allNumbers = (record.allNumbers?.length ? record.allNumbers : topNumbers18).map(normalizeLegacyNumber);
    const allZodiacs = (record.allZodiacs?.length ? record.allZodiacs : topZodiacs9).map(normalizeLegacyZodiac);
    return {
        ...record,
        schemaVersion: 2,
        supportSignalCount: record.supportSignalCount ?? 0,
        opposeSignalCount: record.opposeSignalCount ?? 0,
        topNumbers8: (record.topNumbers8 ?? allNumbers.slice(0, 8)).map(normalizeLegacyNumber),
        topNumbers12: (record.topNumbers12 ?? allNumbers.slice(0, 12)).map(normalizeLegacyNumber),
        topNumbers16: (record.topNumbers16 ?? allNumbers.slice(0, 16)).map(normalizeLegacyNumber),
        topNumbers18,
        topZodiacs7: (record.topZodiacs7 ?? allZodiacs.slice(0, 7)).map(normalizeLegacyZodiac),
        topZodiacs8: (record.topZodiacs8 ?? allZodiacs.slice(0, 8)).map(normalizeLegacyZodiac),
        topZodiacs9,
        allNumbers,
        allZodiacs,
        evidenceSummary: record.evidenceSummary ?? []
    };
}
function outcomeBand(rank) {
    if (!rank) return "outside";
    if (rank <= 8) return "top8";
    if (rank <= 12) return "top9_12";
    if (rank <= 18) return "top13_18";
    return "outside";
}
function resolveReferenceHistoryOutcomes(records, draws, config) {
    const sortedDraws = sortDrawRecords(draws);
    return records.map((inputRecord)=>{
        const record = normalizedRecord(inputRecord);
        const currentIndex = sortedDraws.findIndex((draw)=>draw.issue === record.baseIssue);
        const nextDraw = currentIndex >= 0 ? sortedDraws[currentIndex + 1] : undefined;
        if (!nextDraw) return record;
        const attributes = (0,engine_attributes/* getNumberAttributes */.hJ)(nextDraw.special, config);
        const numberRank = record.allNumbers.find((item)=>item.number === nextDraw.special)?.rank;
        const outcome = {
            nextIssue: nextDraw.issue,
            special: nextDraw.special,
            zodiac: attributes.zodiac,
            hitTop8: record.topNumbers8.some((item)=>item.number === nextDraw.special),
            hitTop12: record.topNumbers12.some((item)=>item.number === nextDraw.special),
            hitTop18: record.topNumbers18.some((item)=>item.number === nextDraw.special),
            hitZodiac7: record.topZodiacs7.some((item)=>item.zodiac === attributes.zodiac),
            hitZodiac9: record.topZodiacs9.some((item)=>item.zodiac === attributes.zodiac),
            hitNumberRank: numberRank,
            hitBand: outcomeBand(numberRank),
            resolvedAt: new Date().toISOString()
        };
        const allNumbers = record.allNumbers.map((item)=>({
                ...item,
                hit: item.number === nextDraw.special
            }));
        const allZodiacs = record.allZodiacs.map((item)=>({
                ...item,
                hit: item.zodiac === attributes.zodiac
            }));
        return {
            ...record,
            targetIssue: nextDraw.issue,
            outcome,
            allNumbers,
            allZodiacs,
            topNumbers8: record.topNumbers8.map((item)=>({
                    ...item,
                    hit: item.number === nextDraw.special
                })),
            topNumbers12: record.topNumbers12.map((item)=>({
                    ...item,
                    hit: item.number === nextDraw.special
                })),
            topNumbers16: record.topNumbers16.map((item)=>({
                    ...item,
                    hit: item.number === nextDraw.special
                })),
            topNumbers18: record.topNumbers18.map((item)=>({
                    ...item,
                    hit: item.number === nextDraw.special
                })),
            topZodiacs7: record.topZodiacs7.map((item)=>({
                    ...item,
                    hit: item.zodiac === attributes.zodiac
                })),
            topZodiacs8: record.topZodiacs8.map((item)=>({
                    ...item,
                    hit: item.zodiac === attributes.zodiac
                })),
            topZodiacs9: record.topZodiacs9.map((item)=>({
                    ...item,
                    hit: item.zodiac === attributes.zodiac
                })),
            actualNextIssue: nextDraw.issue,
            actualSpecial: nextDraw.special,
            actualZodiac: attributes.zodiac,
            hitTop8: outcome.hitTop8,
            hitTop12: outcome.hitTop12,
            hitTop18: outcome.hitTop18,
            hitZodiac7: outcome.hitZodiac7,
            hitZodiac9: outcome.hitZodiac9
        };
    });
}
function trimReferenceHistory(records, limit = 500) {
    const unique = new Map();
    records.forEach((record)=>unique.set(record.id, normalizedRecord(record)));
    return [
        ...unique.values()
    ].sort((a, b)=>b.savedAt.localeCompare(a.savedAt)).slice(0, limit);
}
function referenceHistoryNumberText(item) {
    return `${reference_history_padNumber(item.number)} ${item.zodiac}`;
}

// EXTERNAL MODULE: ./node_modules/.pnpm/zustand@5.0.14_@types+react@19.2.17_immer@11.1.8_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs + 1 modules
var esm_react = __webpack_require__(9108);
// EXTERNAL MODULE: ./node_modules/.pnpm/dexie@4.4.4/node_modules/dexie/import-wrapper-prod.mjs
var import_wrapper_prod = __webpack_require__(8964);
;// ./src/lib/storage/rule-snapshot.ts
const RULE_LIBRARY_SNAPSHOT_KEY = "rulequant:rule-library:v1";
const RULE_LIBRARY_CACHE_NAME = "rulequant-rule-library-backup-v1";
const RULE_LIBRARY_CACHE_PATH = "/__rulequant__/rule-library-backup-v1.json";
const MAX_LOCAL_SNAPSHOT_BYTES = 1500000;
function browserStorage() {
    if (false) {}
    try {
        return window.localStorage;
    } catch  {
        return undefined;
    }
}
function isRuleRecord(value) {
    if (!value || typeof value !== "object") return false;
    const rule = value;
    return Boolean(typeof rule.id === "string" && rule.id.trim() && typeof rule.formula === "string" && rule.formula.trim() && typeof rule.name === "string");
}
function timestampValue(value) {
    const time = Date.parse(value ?? "");
    return Number.isFinite(time) ? time : 0;
}
function buildSnapshot(rules) {
    return {
        version: 1,
        savedAt: new Date().toISOString(),
        rules
    };
}
function parseSnapshot(raw) {
    if (!raw) return [];
    try {
        const snapshot = JSON.parse(raw);
        if (snapshot.version !== 1 || !Array.isArray(snapshot.rules)) return [];
        return snapshot.rules.filter(isRuleRecord);
    } catch  {
        return [];
    }
}
function cacheRequest() {
    if (false) {}
    return new Request(new URL(RULE_LIBRARY_CACHE_PATH, window.location.origin));
}
function mergeRuleSnapshots(primaryRules, backupRules) {
    const merged = new Map(primaryRules.map((rule)=>[
            rule.id,
            rule
        ]));
    backupRules.forEach((backupRule)=>{
        const primaryRule = merged.get(backupRule.id);
        if (!primaryRule || timestampValue(backupRule.updatedAt) > timestampValue(primaryRule.updatedAt)) {
            merged.set(backupRule.id, backupRule);
        }
    });
    return [
        ...merged.values()
    ];
}
function readRuleLibrarySnapshot(storage = browserStorage()) {
    if (!storage) return [];
    try {
        return parseSnapshot(storage.getItem(RULE_LIBRARY_SNAPSHOT_KEY));
    } catch  {
        return [];
    }
}
function writeRuleLibrarySnapshot(rules, storage = browserStorage()) {
    if (!storage) return false;
    try {
        const payload = JSON.stringify(buildSnapshot(rules));
        if (payload.length > MAX_LOCAL_SNAPSHOT_BYTES) {
            storage.removeItem?.(RULE_LIBRARY_SNAPSHOT_KEY);
            return false;
        }
        storage.setItem(RULE_LIBRARY_SNAPSHOT_KEY, payload);
        return true;
    } catch  {
        return false;
    }
}
async function readRuleLibraryCacheSnapshot() {
    if ( false || !("caches" in window)) return [];
    try {
        const request = cacheRequest();
        if (!request) return [];
        const cache = await window.caches.open(RULE_LIBRARY_CACHE_NAME);
        const response = await cache.match(request);
        return parseSnapshot(await response?.text());
    } catch  {
        return [];
    }
}
async function writeRuleLibraryCacheSnapshot(rules) {
    if ( false || !("caches" in window)) return false;
    try {
        const request = cacheRequest();
        if (!request) return false;
        const cache = await window.caches.open(RULE_LIBRARY_CACHE_NAME);
        await cache.put(request, new Response(JSON.stringify(buildSnapshot(rules)), {
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }));
        return true;
    } catch  {
        return false;
    }
}

;// ./src/lib/storage/db.ts
/* __next_internal_client_entry_do_not_use__ db,loadPersistedState,persistAll,persistReferenceHistoryAndLogs auto */ 

class RuleQuantDatabase extends import_wrapper_prod/* default */.Ay {
    constructor(){
        super("rulequant-terminal");
        this.version(1).stores({
            draws: "issue,date",
            rules: "id,category,enabled",
            samples: "id,ruleId,issue",
            config: "id"
        });
        this.version(2).stores({
            draws: "issue,date",
            rules: "id,category,enabled,sourceType",
            samples: "id,ruleId,issue",
            config: "id",
            logs: "id,timestamp,type,ruleId,issue",
            backups: "id,createdAt"
        });
        this.version(3).stores({
            draws: "issue,date",
            rules: "id,category,enabled,sourceType",
            samples: "id,ruleId,issue",
            config: "id",
            logs: "id,timestamp,type,ruleId,issue",
            backups: "id,createdAt",
            referenceHistory: "id,baseIssue,generatedAt,savedAt,signature"
        });
        this.version(4).stores({
            draws: "issue,date",
            rules: "id,category,enabled,sourceType",
            samples: "id,ruleId,issue",
            config: "id",
            logs: "id,timestamp,type,ruleId,issue",
            backups: "id,createdAt",
            referenceHistory: "id,baseIssue,targetIssue,generatedAt,savedAt,signature,saveType"
        });
    }
}
const db = new RuleQuantDatabase();
let persistenceQueue = Promise.resolve();
function enqueuePersistence(task) {
    persistenceQueue = persistenceQueue.catch(()=>undefined).then(task);
    return persistenceQueue;
}
async function loadPersistedState() {
    const backupRules = mergeRuleSnapshots(readRuleLibrarySnapshot(), await readRuleLibraryCacheSnapshot());
    try {
        const [draws, rules, samples, config, logs, backups, referenceHistory] = await Promise.all([
            db.draws.toArray(),
            db.rules.toArray(),
            db.samples.toArray(),
            db.config.get("default"),
            db.logs.orderBy("timestamp").reverse().toArray(),
            db.backups.orderBy("createdAt").reverse().toArray(),
            db.referenceHistory.orderBy("savedAt").reverse().toArray()
        ]);
        return {
            draws,
            rules: mergeRuleSnapshots(rules, backupRules),
            samples,
            config: config?.value,
            logs,
            backups,
            referenceHistory
        };
    } catch  {
        return {
            draws: [],
            rules: backupRules,
            samples: [],
            config: undefined,
            logs: [],
            backups: [],
            referenceHistory: []
        };
    }
}
async function persistAll(input) {
    const snapshot = {
        draws: [
            ...input.draws
        ],
        rules: [
            ...input.rules
        ],
        samples: [
            ...input.samples
        ],
        config: input.config,
        logs: [
            ...input.logs
        ],
        backups: [
            ...input.backups
        ],
        referenceHistory: [
            ...input.referenceHistory
        ]
    };
    await enqueuePersistence(async ()=>{
        const localSnapshotSaved = writeRuleLibrarySnapshot(snapshot.rules);
        const cacheSnapshotSaved = await writeRuleLibraryCacheSnapshot(snapshot.rules);
        const backupSaved = localSnapshotSaved || cacheSnapshotSaved;
        try {
            await db.transaction("rw", [
                db.draws,
                db.rules,
                db.samples,
                db.config,
                db.logs,
                db.backups,
                db.referenceHistory
            ], async ()=>{
                await db.draws.clear();
                await db.rules.clear();
                await db.samples.clear();
                await db.logs.clear();
                await db.backups.clear();
                await db.referenceHistory.clear();
                await db.draws.bulkPut(snapshot.draws);
                await db.rules.bulkPut(snapshot.rules);
                await db.samples.bulkPut(snapshot.samples);
                await db.config.put({
                    id: "default",
                    value: snapshot.config
                });
                await db.logs.bulkPut(snapshot.logs);
                await db.backups.bulkPut(snapshot.backups);
                await db.referenceHistory.bulkPut(snapshot.referenceHistory);
            });
        } catch (error) {
            if (!backupSaved) throw error;
        }
    });
}
async function persistReferenceHistoryAndLogs(referenceHistory, logs) {
    const nextReferenceHistory = [
        ...referenceHistory
    ];
    const nextLogs = [
        ...logs
    ];
    await enqueuePersistence(async ()=>{
        await db.transaction("rw", [
            db.referenceHistory,
            db.logs
        ], async ()=>{
            await db.referenceHistory.clear();
            await db.logs.clear();
            await db.referenceHistory.bulkPut(nextReferenceHistory);
            await db.logs.bulkPut(nextLogs);
        });
    });
}

;// ./src/store/use-rulequant-store.ts
/* provided dependency */ var process = __webpack_require__(9730);
/* __next_internal_client_entry_do_not_use__ useRuleQuantStore auto */ 







const REMOTE_CLOUD_STATE_ENDPOINT = "https://rulequant-terminal.vercel.app/api/cloud/state";
function use_rulequant_store_sortDraws(draws) {
    return [
        ...draws
    ].sort((a, b)=>{
        const aNumber = /^\d+$/.test(a.issue) ? Number(a.issue) : undefined;
        const bNumber = /^\d+$/.test(b.issue) ? Number(b.issue) : undefined;
        if (aNumber !== undefined && bNumber !== undefined) return aNumber - bNumber;
        if (aNumber !== undefined) return 1;
        if (bNumber !== undefined) return -1;
        return a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        });
    });
}
function makeLog(input) {
    const timestamp = input.timestamp ?? new Date().toISOString();
    return {
        ...input,
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp
    };
}
function makeRuleBackup(rules, reason) {
    return {
        id: `backup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        reason,
        rules: rules.map((rule)=>({
                ...rule
            }))
    };
}
function trimLogs(logs) {
    return [
        ...logs
    ].sort((a, b)=>b.timestamp.localeCompare(a.timestamp)).slice(0, 200);
}
function trimBackups(backups) {
    return [
        ...backups
    ].sort((a, b)=>b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
}
function isManualDraw(record) {
    return record.sourceUrl === "manual://user-input" || record.rawAttributes?.sourceType === "manual";
}
function mergeManualDraws(baseDraws, localDraws) {
    const merged = new Map(baseDraws.map((draw)=>[
            draw.issue,
            draw
        ]));
    localDraws.filter(isManualDraw).forEach((draw)=>merged.set(draw.issue, draw));
    return [
        ...merged.values()
    ];
}
const userCreatedRuleSources = new Set([
    "manual",
    "txt_import",
    "system_recommended",
    "copied"
]);
const SELECTED_RULE_STORAGE_KEY = "rulequant:selectedRuleId";
function readSelectedRuleId() {
    if (false) {}
    try {
        return window.localStorage.getItem(SELECTED_RULE_STORAGE_KEY) ?? "";
    } catch  {
        return "";
    }
}
function writeSelectedRuleId(ruleId) {
    if (false) {}
    try {
        if (ruleId) window.localStorage.setItem(SELECTED_RULE_STORAGE_KEY, ruleId);
        else window.localStorage.removeItem(SELECTED_RULE_STORAGE_KEY);
    } catch  {
    // IndexedDB remains the primary rule store when localStorage is unavailable.
    }
}
function use_rulequant_store_timestampValue(value) {
    const time = Date.parse(value ?? "");
    return Number.isFinite(time) ? time : 0;
}
function isUserCreatedRule(rule) {
    if (userCreatedRuleSources.has(rule.sourceType ?? "user_provided")) return true;
    return !seedRules.some((seedRule)=>seedRule.id === rule.id);
}
function shouldPreferLocalRule(localRule, baseRule) {
    if (isUserCreatedRule(localRule) && use_rulequant_store_timestampValue(localRule.updatedAt) >= use_rulequant_store_timestampValue(baseRule.updatedAt)) return true;
    return use_rulequant_store_timestampValue(localRule.updatedAt) > use_rulequant_store_timestampValue(baseRule.updatedAt);
}
function mergeLocalRules(baseRules, localRules) {
    const merged = new Map(baseRules.map((rule)=>[
            rule.id,
            rule
        ]));
    localRules.forEach((localRule)=>{
        const current = merged.get(localRule.id);
        if (!current) {
            if (isUserCreatedRule(localRule)) merged.set(localRule.id, localRule);
            return;
        }
        if (shouldPreferLocalRule(localRule, current)) merged.set(localRule.id, localRule);
    });
    return [
        ...merged.values()
    ];
}
function normalizeRuleForLibrary(rule, fallback) {
    const normalized = {
        ...fallback,
        ...rule,
        sourceType: rule.sourceType ?? fallback?.sourceType ?? "user_provided",
        manuallyConfirmed: rule.manuallyConfirmed ?? fallback?.manuallyConfirmed ?? false,
        participatesInReference: rule.participatesInReference ?? fallback?.participatesInReference ?? true,
        positionPattern: rule.positionPattern ?? fallback?.positionPattern ?? [],
        anchorIssue: rule.anchorIssue ?? fallback?.anchorIssue,
        anchorPatternIndex: rule.anchorPatternIndex ?? fallback?.anchorPatternIndex,
        positionMeaning: rule.positionMeaning ?? fallback?.positionMeaning
    };
    return normalizeRuleDraft(normalized, {
        existingRule: fallback,
        forceNewId: false,
        now: normalized.updatedAt
    });
}
function normalizeConfigForCurrentRules(config) {
    return {
        ...defaultConfig,
        ...config ?? {},
        colorValues: defaultConfig.colorValues,
        elementTable: defaultConfig.elementTable,
        elementValues: defaultConfig.elementValues
    };
}
function mergeRulesWithSeedRules(rules) {
    const seedById = new Map(seedRules.map((rule)=>[
            rule.id,
            rule
        ]));
    const existing = new Set(rules.map((rule)=>rule.id));
    const missingSeedRules = seedRules.filter((rule)=>!existing.has(rule.id));
    return [
        ...rules,
        ...missingSeedRules
    ].map((rule)=>normalizeRuleForLibrary(rule, seedById.get(rule.id)));
}
function buildHydratedState(input) {
    const cloudDraws = input.cloud?.draws ?? [];
    const cloudRules = input.cloud?.rules ?? [];
    const cloudSamples = input.cloud?.samples ?? [];
    const cloudLogs = input.cloud?.logs ?? [];
    const cloudBackups = input.cloud?.backups ?? [];
    const cloudReferenceHistory = input.cloud?.referenceHistory ?? [];
    const baseDraws = cloudDraws.length ? cloudDraws : input.persisted.draws.length ? input.persisted.draws : seedDraws;
    const localDraws = [
        ...input.persisted.draws ?? [],
        ...input.current.draws.filter(isManualDraw)
    ];
    const nextDraws = mergeManualDraws(baseDraws, localDraws);
    const baseRules = cloudRules.length ? cloudRules : input.persisted.rules.length ? input.persisted.rules : seedRules;
    const localRules = [
        ...input.persisted.rules ?? [],
        ...input.current.rules.filter(isUserCreatedRule)
    ];
    const nextRules = mergeRulesWithSeedRules(mergeLocalRules(baseRules, localRules));
    const nextSamples = cloudSamples.length ? cloudSamples : input.persisted.samples.length ? input.persisted.samples : seedSampleCases;
    const nextConfig = normalizeConfigForCurrentRules(input.cloud?.config ?? input.persisted.config ?? seedConfig);
    const nextLogs = cloudLogs.length ? trimLogs([
        ...cloudLogs,
        ...input.persisted.logs ?? []
    ]) : trimLogs(input.persisted.logs ?? []);
    const nextBackups = cloudBackups.length ? trimBackups([
        ...cloudBackups,
        ...input.persisted.backups ?? []
    ]) : trimBackups(input.persisted.backups ?? []);
    const nextReferenceHistory = cloudReferenceHistory.length ? trimReferenceHistory([
        ...cloudReferenceHistory,
        ...input.persisted.referenceHistory ?? []
    ]) : trimReferenceHistory(input.persisted.referenceHistory ?? []);
    const requestedRuleId = input.preferredSelectedRuleId || input.current.selectedRuleId;
    const selectedRuleId = nextRules.some((rule)=>rule.id === requestedRuleId) ? requestedRuleId : nextRules[0]?.id ?? "";
    return {
        draws: use_rulequant_store_sortDraws(nextDraws),
        rules: nextRules,
        samples: nextSamples,
        operationLogs: nextLogs,
        ruleBackups: nextBackups,
        referenceHistory: nextReferenceHistory,
        config: nextConfig,
        cloudStateMeta: input.cloud?.meta,
        selectedRuleId,
        hasHydrated: true
    };
}
async function loadCloudStateFromApi() {
    if (false) {}
    const staticBasePath = "/rulequant-terminal-pages" ?? 0;
    const isGithubPagesHost = window.location.hostname.endsWith("github.io");
    const endpoints = (isGithubPagesHost ? [
        `${staticBasePath}/static-cloud-state.json`
    ] : [
        "/api/cloud/state",
        REMOTE_CLOUD_STATE_ENDPOINT,
        `${staticBasePath}/static-cloud-state.json`,
        "/static-cloud-state.json",
        "../static-cloud-state.json"
    ]).filter((endpoint, index, list)=>endpoint && list.indexOf(endpoint) === index);
    let bestState = null;
    let bestIssue = 0;
    for (const endpoint of endpoints){
        try {
            const url = endpoint.includes("?") ? `${endpoint}&t=${Date.now()}` : `${endpoint}?t=${Date.now()}`;
            const response = await fetch(url, {
                cache: "no-store"
            });
            if (!response.ok) continue;
            const state = await response.json();
            if (!state.meta?.enabled) continue;
            const metaIssue = state.meta.latestIssue && /^\d+$/.test(state.meta.latestIssue) ? Number(state.meta.latestIssue) : 0;
            const drawIssue = Math.max(0, ...(state.draws ?? []).map((draw)=>/^\d+$/.test(draw.issue) ? Number(draw.issue) : 0).filter(Number.isFinite));
            const stateIssue = Math.max(metaIssue, drawIssue);
            if (!bestState || stateIssue > bestIssue) {
                bestState = state;
                bestIssue = stateIssue;
            }
        } catch  {
            continue;
        }
    }
    return bestState;
}
const useRuleQuantStore = (0,esm_react/* create */.v)((set, get)=>({
        draws: seedDraws,
        rules: mergeRulesWithSeedRules(seedRules),
        samples: seedSampleCases,
        operationLogs: [],
        ruleBackups: [],
        referenceHistory: [],
        config: seedConfig,
        cloudStateMeta: undefined,
        cloudPublishStatus: "idle",
        cloudPublishMessage: "",
        lastCloudPublishAt: undefined,
        hasHydrated: false,
        selectedRuleId: seedRules[0]?.id ?? "",
        hydrate: async ()=>{
            const persisted = await loadPersistedState();
            const preferredSelectedRuleId = readSelectedRuleId();
            set(buildHydratedState({
                persisted,
                current: get(),
                preferredSelectedRuleId
            }));
            const cloud = await loadCloudStateFromApi();
            if (cloud) {
                set(buildHydratedState({
                    persisted,
                    cloud,
                    current: get(),
                    preferredSelectedRuleId: readSelectedRuleId()
                }));
            }
        },
        persist: async ()=>{
            const state = get();
            await persistAll({
                draws: state.draws,
                rules: state.rules,
                samples: state.samples,
                config: state.config,
                logs: state.operationLogs,
                backups: state.ruleBackups,
                referenceHistory: state.referenceHistory
            });
            if (true) {
                const token = window.localStorage.getItem("rulequant:adminToken") || process.env.NEXT_PUBLIC_RULEQUANT_ADMIN_TOKEN || "";
                if (token) void get().publishCloudState("auto");
            }
        },
        publishCloudState: async (reason = "manual")=>{
            if (false) {}
            const token = window.localStorage.getItem("rulequant:adminToken") || process.env.NEXT_PUBLIC_RULEQUANT_ADMIN_TOKEN || "";
            const endpoint = window.location.hostname.endsWith("github.io") ? REMOTE_CLOUD_STATE_ENDPOINT : "/api/cloud/state";
            const state = get();
            set({
                cloudPublishStatus: "publishing",
                cloudPublishMessage: "正在发布到云端..."
            });
            try {
                const response = await fetch(`${endpoint}?t=${Date.now()}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...token ? {
                            Authorization: `Bearer ${token}`
                        } : {}
                    },
                    cache: "no-store",
                    body: JSON.stringify({
                        draws: state.draws,
                        rules: state.rules,
                        samples: state.samples,
                        config: state.config,
                        logs: state.operationLogs,
                        backups: state.ruleBackups,
                        referenceHistory: state.referenceHistory
                    })
                });
                const data = await response.json().catch(()=>({}));
                if (response.status === 401) {
                    set({
                        cloudPublishStatus: "local_only",
                        cloudPublishMessage: "已保存到本机。云端设置了管理员密钥，需要管理员发布后朋友才能看到。"
                    });
                    return;
                }
                if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
                const publishedAt = new Date().toISOString();
                set({
                    cloudPublishStatus: "published",
                    cloudPublishMessage: reason === "auto" ? "已同步到云端" : "已发布到云端，朋友刷新后可看到。",
                    lastCloudPublishAt: publishedAt,
                    cloudStateMeta: data.state?.meta ?? state.cloudStateMeta
                });
            } catch (error) {
                set({
                    cloudPublishStatus: "failed",
                    cloudPublishMessage: `本机已保存，云端发布失败：${error instanceof Error ? error.message : String(error)}`
                });
            }
        },
        resetSeed: async ()=>{
            const nextRules = mergeRulesWithSeedRules(seedRules);
            const backup = makeRuleBackup(get().rules, "恢复示例数据前自动备份");
            const log = makeLog({
                type: "rules_reset",
                message: "恢复示例数据和内置公式",
                formulaCount: nextRules.length
            });
            set({
                draws: seedDraws,
                rules: nextRules,
                samples: seedSampleCases,
                config: defaultConfig,
                selectedRuleId: nextRules[0]?.id ?? "",
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        resetRules: async ()=>{
            const nextRules = mergeRulesWithSeedRules(seedRules);
            const backup = makeRuleBackup(get().rules, "重置为内置公式前自动备份");
            const log = makeLog({
                type: "rules_reset",
                message: "公式库已重置为内置公式",
                formulaCount: nextRules.length
            });
            set({
                rules: nextRules,
                selectedRuleId: nextRules[0]?.id ?? "",
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        importDraws: async (records)=>{
            const merged = new Map(get().draws.map((draw)=>[
                    draw.issue,
                    draw
                ]));
            records.forEach((record)=>merged.set(record.issue, record));
            const nextDraws = use_rulequant_store_sortDraws([
                ...merged.values()
            ]);
            const latest = nextDraws.at(-1);
            const log = makeLog({
                type: "sync_draws",
                message: `合并导入开奖数据 ${records.length} 条`,
                issue: latest?.issue,
                dataCount: nextDraws.length
            });
            set({
                draws: nextDraws,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        replaceDraws: async (records)=>{
            if (!records.length) {
                const log = makeLog({
                    type: "sync_draws",
                    message: "忽略空开奖数据替换请求，已保留现有开奖库",
                    dataCount: get().draws.length
                });
                set({
                    operationLogs: trimLogs([
                        log,
                        ...get().operationLogs
                    ])
                });
                await get().persist();
                return;
            }
            const merged = new Map(records.map((record)=>[
                    record.issue,
                    record
                ]));
            get().draws.filter(isManualDraw).forEach((record)=>merged.set(record.issue, record));
            const nextDraws = use_rulequant_store_sortDraws([
                ...merged.values()
            ]);
            const latest = nextDraws.at(-1);
            const log = makeLog({
                type: "sync_draws",
                message: `替换开奖数据 ${nextDraws.length} 条`,
                issue: latest?.issue,
                dataCount: nextDraws.length
            });
            set({
                draws: nextDraws,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        deleteDraw: async (issue)=>{
            const deleted = get().draws.find((draw)=>draw.issue === issue);
            const nextDraws = get().draws.filter((draw)=>draw.issue !== issue);
            const log = makeLog({
                type: "sync_draws",
                message: `删除开奖数据：${issue}${deleted && isManualDraw(deleted) ? "（人工录入）" : ""}`,
                issue,
                dataCount: nextDraws.length,
                details: {
                    sourceType: deleted ? deleted.rawAttributes?.sourceType ?? deleted.sourceUrl ?? "unknown" : "unknown",
                    numbers: deleted ? [
                        deleted.n1,
                        deleted.n2,
                        deleted.n3,
                        deleted.n4,
                        deleted.n5,
                        deleted.n6,
                        deleted.special
                    ] : []
                }
            });
            set({
                draws: nextDraws,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        importRules: async (records)=>{
            const normalized = records.map((rule)=>normalizeRuleForLibrary(rule));
            const backup = makeRuleBackup(get().rules, "导入公式库 JSON 前自动备份");
            const log = makeLog({
                type: "rules_imported",
                message: `导入公式库 ${normalized.length} 条`,
                formulaCount: normalized.length
            });
            set({
                rules: normalized,
                selectedRuleId: normalized[0]?.id ?? "",
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        appendRules: async (records, reason = "追加导入 TXT 公式")=>{
            return get().addRulesToLibrary(records, reason);
        },
        addRuleToLibrary: async (draft, reason = "加入公式库")=>{
            const result = addRuleToLibrary({
                existingRules: get().rules,
                draft,
                mode: draft.id && get().rules.some((rule)=>rule.id === draft.id) ? "update" : "add"
            });
            if (!result.ok) {
                const log = makeLog({
                    type: "calculation_error",
                    message: `${reason}失败：${result.reason}`,
                    ruleId: result.duplicate?.id,
                    ruleName: result.duplicate?.name,
                    details: {
                        errors: result.errors,
                        duplicateId: result.duplicate?.id,
                        signature: result.signature
                    }
                });
                set({
                    operationLogs: trimLogs([
                        log,
                        ...get().operationLogs
                    ])
                });
                await get().persist();
                return result;
            }
            const existed = get().rules.some((rule)=>rule.id === result.rule.id);
            const backup = makeRuleBackup(get().rules, `${reason}前自动备份`);
            const log = makeLog({
                type: existed ? "rule_updated" : "rule_created",
                message: `${reason}：${result.rule.name}`,
                ruleId: result.rule.id,
                ruleName: result.rule.name,
                formulaCount: result.rules.length,
                details: {
                    sourceType: result.rule.sourceType,
                    participatesInReference: result.rule.participatesInReference,
                    signature: result.signature
                }
            });
            set({
                rules: result.rules,
                selectedRuleId: result.rule.id,
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            writeSelectedRuleId(result.rule.id);
            await get().persist();
            return result;
        },
        addRulesToLibrary: async (drafts, reason = "批量加入公式库")=>{
            const result = addRulesToLibrary(get().rules, drafts);
            const backup = makeRuleBackup(get().rules, `${reason}前自动备份`);
            const log = makeLog({
                type: "rules_imported",
                message: `${reason}：新增 ${result.added.length} 条，重复 ${result.duplicates.length} 条，失败 ${result.failed.length} 条`,
                formulaCount: result.rules.length,
                details: {
                    addedIds: result.added.map((rule)=>rule.id),
                    duplicateIds: result.duplicates.map((rule)=>rule.id),
                    failedReasons: result.failed.map((item)=>item.reason)
                }
            });
            set({
                rules: result.rules,
                selectedRuleId: result.added[0]?.id ?? get().selectedRuleId,
                ruleBackups: result.added.length ? trimBackups([
                    backup,
                    ...get().ruleBackups
                ]) : get().ruleBackups,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
            return result;
        },
        restoreLastRuleBackup: async ()=>{
            const backupToRestore = get().ruleBackups[0];
            if (!backupToRestore) return;
            const currentBackup = makeRuleBackup(get().rules, "恢复上一次公式库前自动备份");
            const restoredRules = backupToRestore.rules.map((rule)=>normalizeRuleForLibrary(rule));
            const log = makeLog({
                type: "rules_restored",
                message: `已恢复公式库备份：${backupToRestore.reason}`,
                formulaCount: restoredRules.length
            });
            set({
                rules: restoredRules,
                selectedRuleId: restoredRules[0]?.id ?? "",
                ruleBackups: trimBackups([
                    currentBackup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        addOperationLog: async (logInput)=>{
            const log = makeLog(logInput);
            set({
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        saveReferenceHistory: async (record)=>{
            const nextHistory = trimReferenceHistory([
                record,
                ...get().referenceHistory.filter((item)=>item.id !== record.id)
            ]);
            const log = makeLog({
                type: "generate_reference",
                message: `${record.saveType === "manual" ? "手动保存" : "自动保存"}综合推荐记录：${record.baseIssue ?? "-"}期`,
                issue: record.baseIssue,
                formulaCount: record.ruleCount,
                signalCount: record.signalCount,
                details: {
                    top8: record.topNumbers8.map((item)=>item.number),
                    top18: record.topNumbers18.map((item)=>item.number),
                    top9Zodiacs: record.topZodiacs9.map((item)=>item.zodiac)
                }
            });
            set({
                referenceHistory: nextHistory,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await persistReferenceHistoryAndLogs(get().referenceHistory, get().operationLogs);
        },
        deleteReferenceHistory: async (recordId)=>{
            set({
                referenceHistory: get().referenceHistory.filter((record)=>record.id !== recordId)
            });
            await persistReferenceHistoryAndLogs(get().referenceHistory, get().operationLogs);
        },
        clearReferenceHistory: async ()=>{
            const log = makeLog({
                type: "generate_reference",
                message: "清空综合推荐历史记录"
            });
            set({
                referenceHistory: [],
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await persistReferenceHistoryAndLogs(get().referenceHistory, get().operationLogs);
        },
        upsertRule: async (rule)=>{
            return get().addRuleToLibrary(rule, get().rules.some((item)=>item.id === rule.id) ? "修改公式" : "新增公式");
        },
        duplicateRule: async (ruleId)=>{
            const rule = get().rules.find((item)=>item.id === ruleId);
            if (!rule) return;
            const result = addRuleToLibrary({
                existingRules: get().rules,
                draft: {
                    ...rule,
                    id: undefined,
                    name: `${rule.name} 副本`,
                    sourceType: "copied",
                    origin: rule.id,
                    manuallyConfirmed: false
                },
                mode: "add",
                allowDuplicate: true
            });
            if (!result.ok) {
                const log = makeLog({
                    type: "calculation_error",
                    message: `复制公式失败：${result.reason}`,
                    ruleId: rule.id,
                    ruleName: rule.name,
                    details: {
                        errors: result.errors
                    }
                });
                set({
                    operationLogs: trimLogs([
                        log,
                        ...get().operationLogs
                    ])
                });
                await get().persist();
                return;
            }
            const backup = makeRuleBackup(get().rules, `复制公式：${rule.name}`);
            const log = makeLog({
                type: "rule_created",
                message: `复制公式：${result.rule.name}`,
                ruleId: result.rule.id,
                ruleName: result.rule.name,
                formulaCount: result.rules.length
            });
            set({
                rules: result.rules,
                selectedRuleId: result.rule.id,
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
            return;
        },
        deleteRule: async (ruleId)=>{
            const deleted = get().rules.find((item)=>item.id === ruleId);
            const rules = get().rules.filter((item)=>item.id !== ruleId);
            const backup = makeRuleBackup(get().rules, `删除公式：${deleted?.name ?? ruleId}`);
            const log = makeLog({
                type: "rule_deleted",
                message: `删除公式：${deleted?.name ?? ruleId}`,
                ruleId,
                ruleName: deleted?.name,
                formulaCount: rules.length
            });
            set({
                rules,
                selectedRuleId: rules[0]?.id ?? "",
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        toggleRule: async (ruleId)=>{
            const target = get().rules.find((rule)=>rule.id === ruleId);
            const nextEnabled = !target?.enabled;
            const backup = makeRuleBackup(get().rules, `${nextEnabled ? "启用" : "停用"}公式：${target?.name ?? ruleId}`);
            const log = makeLog({
                type: nextEnabled ? "rule_enabled" : "rule_disabled",
                message: `${nextEnabled ? "启用" : "停用"}公式：${target?.name ?? ruleId}`,
                ruleId,
                ruleName: target?.name
            });
            set({
                rules: get().rules.map((rule)=>rule.id === ruleId ? {
                        ...rule,
                        enabled: !rule.enabled,
                        updatedAt: new Date().toISOString()
                    } : rule),
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        toggleReferenceParticipation: async (ruleId)=>{
            const target = get().rules.find((rule)=>rule.id === ruleId);
            const nextParticipates = target?.participatesInReference === false;
            const backup = makeRuleBackup(get().rules, `${nextParticipates ? "加入" : "退出"}综合参考：${target?.name ?? ruleId}`);
            const log = makeLog({
                type: "rule_reference_changed",
                message: `${nextParticipates ? "加入" : "退出"}综合参考：${target?.name ?? ruleId}`,
                ruleId,
                ruleName: target?.name
            });
            set({
                rules: get().rules.map((rule)=>rule.id === ruleId ? {
                        ...rule,
                        participatesInReference: rule.participatesInReference === false,
                        updatedAt: new Date().toISOString()
                    } : rule),
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        confirmRule: async (ruleId)=>{
            const target = get().rules.find((rule)=>rule.id === ruleId);
            const backup = makeRuleBackup(get().rules, `人工确认公式：${target?.name ?? ruleId}`);
            const log = makeLog({
                type: "rule_updated",
                message: `人工确认公式：${target?.name ?? ruleId}`,
                ruleId,
                ruleName: target?.name
            });
            set({
                rules: get().rules.map((rule)=>rule.id === ruleId ? {
                        ...rule,
                        manuallyConfirmed: true,
                        updatedAt: new Date().toISOString()
                    } : rule),
                ruleBackups: trimBackups([
                    backup,
                    ...get().ruleBackups
                ]),
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        },
        setSelectedRule: (ruleId)=>{
            writeSelectedRuleId(ruleId);
            set({
                selectedRuleId: ruleId
            });
        },
        upsertSample: async (sample)=>{
            const samples = get().samples.filter((item)=>item.id !== sample.id);
            set({
                samples: [
                    sample,
                    ...samples
                ]
            });
            await get().persist();
        },
        updateConfig: async (config)=>{
            const draw = get().draws[0] ?? seedDraws[0];
            (0,engine_attributes/* normalizeDraw */.YC)(draw, config);
            const rule = get().rules[0] ?? seedRules[0];
            runRuleCalculation(rule, (0,engine_attributes/* normalizeDraw */.YC)(draw, config), config);
            const log = makeLog({
                type: "rule_updated",
                message: "修改基础表配置，综合参考需要重新计算"
            });
            set({
                config,
                operationLogs: trimLogs([
                    log,
                    ...get().operationLogs
                ])
            });
            await get().persist();
        }
    }));

// EXTERNAL MODULE: ./node_modules/.pnpm/@tanstack+react-table@8.21.3_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/@tanstack/react-table/build/lib/index.mjs
var lib = __webpack_require__(6442);
// EXTERNAL MODULE: ./node_modules/.pnpm/@tanstack+table-core@8.21.3/node_modules/@tanstack/table-core/build/lib/index.mjs
var build_lib = __webpack_require__(4376);
// EXTERNAL MODULE: ./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(6446);
// EXTERNAL MODULE: ./node_modules/.pnpm/tailwind-merge@3.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var bundle_mjs = __webpack_require__(7378);
;// ./src/lib/utils.ts


function cn(...inputs) {
    return (0,bundle_mjs/* twMerge */.QP)((0,clsx/* clsx */.$)(inputs));
}

;// ./src/components/tables/data-table.tsx
/* __next_internal_client_entry_do_not_use__ DataTable auto */ 



function DataTable({ data, columns, dense = false }) {
    const [sorting, setSorting] = (0,react.useState)([]);
    const [globalFilter, setGlobalFilter] = (0,react.useState)("");
    const [pagination, setPagination] = (0,react.useState)({
        pageIndex: 0,
        pageSize: 20
    });
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = (0,lib/* useReactTable */.N4)({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: (0,build_lib/* getCoreRowModel */.HT)(),
        getSortedRowModel: (0,build_lib/* getSortedRowModel */.h5)(),
        getFilteredRowModel: (0,build_lib/* getFilteredRowModel */.hM)(),
        getPaginationRowModel: (0,build_lib/* getPaginationRowModel */.kW)()
    });
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "max-w-full overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.035] shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 border-b border-white/[0.08] bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                        value: globalFilter,
                        onChange: (event)=>setGlobalFilter(event.target.value),
                        placeholder: "搜索期号、公式、结果...",
                        className: "h-10 w-full rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10 sm:max-w-sm"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 sm:justify-end",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "sm:hidden",
                                children: "横向滑动查看更多列"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                className: "shrink-0",
                                children: [
                                    "显示 ",
                                    table.getFilteredRowModel().rows.length,
                                    " / ",
                                    data.length
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "rq-scrollbar max-h-[560px] overflow-auto [-webkit-overflow-scrolling:touch]",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                    className: "w-full min-w-[640px] border-collapse text-left text-xs sm:min-w-[760px] sm:text-sm",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                            className: "sticky top-0 z-10 bg-[#0b0f1a]/95 backdrop-blur",
                            children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("tr", {
                                    children: headerGroup.headers.map((header)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                            className: "border-b border-white/[0.08] px-2 py-2 text-xs font-medium text-slate-500 sm:px-3 sm:py-3",
                                            children: header.isPlaceholder ? null : /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                type: "button",
                                                onClick: header.column.getToggleSortingHandler(),
                                                className: cn("inline-flex min-w-0 items-center gap-1 text-left", header.column.getCanSort() && "hover:text-slate-200"),
                                                children: [
                                                    (0,lib/* flexRender */.Kv)(header.column.columnDef.header, header.getContext()),
                                                    header.column.getIsSorted() === "asc" && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "↑"
                                                    }),
                                                    header.column.getIsSorted() === "desc" && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: "↓"
                                                    })
                                                ]
                                            })
                                        }, header.id))
                                }, headerGroup.id))
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                            children: table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("tr", {
                                    className: "border-b border-white/[0.05] transition hover:bg-white/[0.035]",
                                    children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: cn("px-2 align-top text-slate-200 sm:px-3", dense ? "py-2" : "py-2.5 sm:py-3"),
                                            children: (0,lib/* flexRender */.Kv)(cell.column.columnDef.cell, cell.getContext())
                                        }, cell.id))
                                }, row.id))
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 border-t border-white/[0.08] bg-black/20 px-3 py-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        className: "leading-5",
                        children: [
                            "第 ",
                            table.getState().pagination.pageIndex + 1,
                            " / ",
                            Math.max(table.getPageCount(), 1),
                            " 页，每页 20 条"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                type: "button",
                                onClick: ()=>table.previousPage(),
                                disabled: !table.getCanPreviousPage(),
                                className: "rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-100 disabled:opacity-40",
                                children: "上一页"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                type: "button",
                                onClick: ()=>table.nextPage(),
                                disabled: !table.getCanNextPage(),
                                className: "rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-100 disabled:opacity-40",
                                children: "下一页"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

;// ./src/components/ui/badge.tsx


const tones = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
    green: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    yellow: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    rose: "border-rose-300/30 bg-rose-300/10 text-rose-100",
    slate: "border-white/10 bg-white/[0.06] text-slate-300"
};
function Badge({ className, tone = "slate", ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
        className: cn("inline-flex min-h-6 min-w-0 max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md border px-2 py-1 text-[12px] font-medium leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]", tones[tone], className),
        ...props
    });
}

;// ./src/components/ui/button.tsx


const variants = {
    primary: "border-cyan-200/40 bg-cyan-300/16 text-cyan-50 shadow-[0_8px_24px_rgba(34,211,238,0.08)] hover:border-cyan-100/60 hover:bg-cyan-300/24",
    secondary: "border-white/10 bg-white/[0.055] text-slate-100 hover:border-white/16 hover:bg-white/[0.09]",
    ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
    danger: "border-rose-300/28 bg-rose-400/10 text-rose-50 hover:border-rose-200/45 hover:bg-rose-400/18"
};
const sizes = {
    sm: "h-8 min-h-8 px-3 text-[12px]",
    md: "h-10 min-h-10 px-4 text-sm max-sm:h-11 max-sm:min-h-11 max-sm:px-3 max-sm:text-[13px]",
    icon: "h-10 w-10 min-w-10 p-0 max-sm:h-11 max-sm:w-11 max-sm:min-w-11"
};
function Button({ className, variant = "secondary", size = "md", loading = false, disabled, children, ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
        className: cn("inline-flex min-w-0 max-w-full shrink-0 touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 [&>svg]:shrink-0", variants[variant], sizes[size], className),
        "aria-busy": loading || undefined,
        disabled: disabled || loading,
        ...props,
        children: [
            loading && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                "aria-hidden": "true",
                className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            }),
            children
        ]
    });
}

;// ./src/components/ui/field.tsx



const base = "min-w-0 w-full rounded-md border border-white/10 bg-white/[0.05] px-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] outline-none backdrop-blur-xl transition placeholder:text-slate-600 hover:border-white/15 focus:border-cyan-200/45 focus:bg-white/[0.075] focus:ring-2 focus:ring-cyan-300/10";
function Input({ className, ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
        className: cn(base, "h-10 max-sm:h-11", className),
        ...props
    });
}
const Textarea = /*#__PURE__*/ (0,react.forwardRef)(function Textarea({ className, ...props }, ref) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("textarea", {
        ref: ref,
        className: cn(base, "min-h-28 py-3 leading-6", className),
        ...props
    });
});
function Select({ className, ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("select", {
        className: cn(base, "h-10 truncate max-sm:h-11", className),
        ...props
    });
}
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
        className: cn("mb-1 block text-xs font-medium leading-5 text-slate-400", className),
        ...props
    });
}

;// ./src/components/ui/panel.tsx


function panel_Panel({ className, ...props }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("section", {
        className: cn("rounded-lg border border-white/[0.085] bg-[#0c1118]/80 shadow-[0_16px_44px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl", className),
        ...props
    });
}

// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs
var triangle_alert = __webpack_require__(3456);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs
var chevron_down = __webpack_require__(7751);
// EXTERNAL MODULE: ./src/lib/formula/evaluate.ts
var evaluate = __webpack_require__(393);
;// ./src/lib/special-analysis/special-analysis.ts


const DRAW_POSITION_LABELS = [
    "平1",
    "平2",
    "平3",
    "平4",
    "平5",
    "平6",
    "特码"
];
function drawNumbers(draw) {
    return [
        draw.n1,
        draw.n2,
        draw.n3,
        draw.n4,
        draw.n5,
        draw.n6,
        draw.special
    ];
}
function buildPositionNineGridTriggers(draws) {
    const sorted = special_analysis_sortDraws(draws);
    const triggers = [];
    for(let index = 1; index < sorted.length; index += 1){
        const previousDraw = sorted[index - 1];
        const triggerDraw = sorted[index];
        const positionIndex = drawNumbers(triggerDraw).indexOf(previousDraw.special);
        if (positionIndex < 0) continue;
        const windowStart = Math.min(Math.max(positionIndex - 1, 0), 4);
        triggers.push({
            previousDraw,
            triggerDraw,
            nextDraw: sorted[index + 1],
            previousSpecial: previousDraw.special,
            positionIndex,
            columnIndexes: [
                windowStart,
                windowStart + 1,
                windowStart + 2
            ]
        });
    }
    return triggers.reverse();
}
const SPECIAL_RULE_SPECS = [
    {
        id: "half-head-l",
        name: "杀半头 · L序",
        category: "杀半头",
        formula: "平2尾 + 平3尾 + 平6头 + 特码合",
        orderMode: "L",
        explanation: "计算结果取个位，再按固定的头数单双表映射到一组排除号码。"
    },
    {
        id: "half-head-d",
        name: "杀半头 · D序",
        category: "杀半头",
        formula: "平1头 + 平2头",
        orderMode: "D",
        explanation: "D序只排序6个平码，特码保持独立；结果取个位后映射到头数单双。"
    },
    {
        id: "kill-color",
        name: "杀一波 · L序",
        category: "杀一波",
        formula: "平1 + 平2五行值 + 平4头 + 平4波色值 + 平5段 + 特尾",
        orderMode: "L",
        explanation: "结果循环减3：0=红波、1=蓝波、2=绿波。"
    },
    {
        id: "kill-door",
        name: "杀一门 · L序",
        category: "杀一门",
        formula: "平2尾 + 平3尾 + 特码合 + 特码五行值 + 期数尾",
        orderMode: "L",
        explanation: "结果循环减5直到落在1-5，再映射到固定门数号码。"
    },
    {
        id: "seven-tail-d",
        name: "七尾新规 · D序",
        category: "七尾",
        formula: "平1尾 + 平5段 + 特码尾",
        orderMode: "D",
        explanation: "先取定位尾，再按 -4、-3、-1、+1、+3、+4、+5 做0-9闭环。"
    },
    {
        id: "kill-element-d",
        name: "杀一行 · D序",
        category: "杀一行",
        formula: "平2尾 + 平3尾 + 特码合 + 特码五行值",
        orderMode: "D",
        explanation: "结果循环减5落到1-5：金1、木2、水3、火4、土5。"
    }
];
const HALF_HEAD_LABELS = {
    0: [
        "4头双"
    ],
    1: [
        "0头单"
    ],
    2: [
        "0头双"
    ],
    3: [
        "1头单"
    ],
    4: [
        "1头双"
    ],
    5: [
        "2头单"
    ],
    6: [
        "3头单",
        "2头双"
    ],
    8: [
        "3头双"
    ],
    9: [
        "4头单"
    ]
};
const DOOR_GROUPS = {
    1: range(1, 9),
    2: range(10, 18),
    3: range(19, 27),
    4: range(28, 37),
    5: range(38, 49)
};
function range(from, to) {
    return Array.from({
        length: to - from + 1
    }, (_, index)=>from + index);
}
function special_analysis_sortDraws(draws) {
    return [
        ...draws
    ].sort((a, b)=>a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        }));
}
function positiveModulo(value, divisor) {
    return (value % divisor + divisor) % divisor;
}
function subtractSteps(raw, step, min, max) {
    const steps = [
        raw
    ];
    let value = raw;
    while(value > max){
        value -= step;
        steps.push(value);
    }
    while(value < min){
        value += step;
        steps.push(value);
    }
    return {
        value,
        steps
    };
}
function halfHeadNumbers(label) {
    const match = label.match(/^(\d)头(单|双)$/);
    if (!match) return [];
    const head = Number(match[1]);
    const parity = match[2] === "单" ? 1 : 0;
    const from = head === 0 ? 1 : head * 10;
    const to = head === 4 ? 49 : head * 10 + 9;
    return range(from, to).filter((number)=>number % 2 === parity);
}
function colorLabel(value, config) {
    const configured = Object.entries(config.colorValues).find(([, itemValue])=>itemValue === value)?.[0];
    return configured ? `${configured}波` : [
        "红波",
        "蓝波",
        "绿波"
    ][value] ?? `${value}波`;
}
function colorNumbers(value, config) {
    const color = Object.entries(config.colorValues).find(([, itemValue])=>itemValue === value)?.[0];
    return color ? config.colorTable[color] ?? [] : [];
}
function resolveTarget(spec, rawResult, config) {
    if (spec.id === "half-head-l" || spec.id === "half-head-d") {
        const normalizedValue = positiveModulo(rawResult, 10);
        const labels = HALF_HEAD_LABELS[normalizedValue] ?? [];
        return {
            normalizedValue,
            normalizerSteps: rawResult === normalizedValue ? [
                rawResult
            ] : [
                rawResult,
                normalizedValue
            ],
            targetLabels: labels,
            targetNumbers: [
                ...new Set(labels.flatMap(halfHeadNumbers))
            ],
            ambiguous: labels.length !== 1
        };
    }
    if (spec.id === "kill-color") {
        const normalizedValue = positiveModulo(rawResult, 3);
        const steps = subtractSteps(rawResult, 3, 0, 2).steps;
        return {
            normalizedValue,
            normalizerSteps: steps,
            targetLabels: [
                colorLabel(normalizedValue, config)
            ],
            targetNumbers: colorNumbers(normalizedValue, config),
            ambiguous: false
        };
    }
    if (spec.id === "seven-tail-d") {
        const normalizedValue = positiveModulo(rawResult, 10);
        const offsets = [
            -4,
            -3,
            -1,
            1,
            3,
            4,
            5
        ];
        const tails = offsets.map((offset)=>positiveModulo(normalizedValue + offset, 10));
        return {
            normalizedValue,
            normalizerSteps: rawResult === normalizedValue ? [
                rawResult
            ] : [
                rawResult,
                normalizedValue
            ],
            targetLabels: [
                `七尾 ${tails.join("、")}`
            ],
            targetNumbers: range(1, 49).filter((number)=>tails.includes(number % 10)),
            ambiguous: false
        };
    }
    if (spec.id === "kill-element-d") {
        const normalized = subtractSteps(rawResult, 5, 1, 5);
        const element = Object.entries(config.elementValues).find(([, value])=>value === normalized.value)?.[0];
        return {
            normalizedValue: normalized.value,
            normalizerSteps: normalized.steps,
            targetLabels: [
                `${element ?? normalized.value}行`
            ],
            targetNumbers: element ? config.elementTable[element] ?? [] : [],
            ambiguous: false
        };
    }
    const normalized = subtractSteps(rawResult, 5, 1, 5);
    return {
        normalizedValue: normalized.value,
        normalizerSteps: normalized.steps,
        targetLabels: [
            `${normalized.value}门`
        ],
        targetNumbers: DOOR_GROUPS[normalized.value] ?? [],
        ambiguous: false
    };
}
function special_analysis_rate(success, total) {
    return total ? Number((success / total * 100).toFixed(2)) : 0;
}
function streakSummary(details) {
    const resolved = details.filter((detail)=>typeof detail.success === "boolean");
    if (!resolved.length) return {
        currentStreak: 0,
        currentStreakType: "none",
        maxSuccessStreak: 0
    };
    let maxSuccessStreak = 0;
    let running = 0;
    resolved.forEach((detail)=>{
        running = detail.success ? running + 1 : 0;
        maxSuccessStreak = Math.max(maxSuccessStreak, running);
    });
    const latest = resolved.at(-1);
    let currentStreak = 0;
    for(let index = resolved.length - 1; index >= 0; index -= 1){
        if (resolved[index].success !== latest.success) break;
        currentStreak += 1;
    }
    return {
        currentStreak,
        currentStreakType: latest.success ? "success" : "failed",
        maxSuccessStreak
    };
}
function scenarioSummary(details, alternativeIndex, label) {
    const resolved = details.filter((detail)=>detail.nextSpecial !== undefined && !detail.error);
    const values = resolved.map((detail)=>{
        if (!detail.ambiguous) return !detail.targetNumbers.includes(detail.nextSpecial);
        const targetLabel = detail.targetLabels[alternativeIndex];
        return targetLabel ? !halfHeadNumbers(targetLabel).includes(detail.nextSpecial) : undefined;
    }).filter((value)=>typeof value === "boolean");
    const success = values.filter(Boolean).length;
    return {
        label,
        total: values.length,
        success,
        rate: special_analysis_rate(success, values.length)
    };
}
function analyzeSpecialRule(specId, draws, config) {
    const spec = SPECIAL_RULE_SPECS.find((item)=>item.id === specId) ?? SPECIAL_RULE_SPECS[0];
    const sorted = special_analysis_sortDraws(draws);
    const details = sorted.map((draw, index)=>{
        const currentNumbers = [
            draw.n1,
            draw.n2,
            draw.n3,
            draw.n4,
            draw.n5,
            draw.n6,
            draw.special
        ];
        try {
            const normalized = (0,engine_attributes/* normalizeDraw */.YC)(draw, config);
            const formula = (0,evaluate/* evaluateFormula */.w)(spec.formula, normalized, config, spec.orderMode);
            const target = resolveTarget(spec, formula.value, config);
            const nextDraw = sorted[index + 1];
            const nextSpecial = nextDraw?.special;
            const success = nextSpecial === undefined || target.ambiguous ? undefined : spec.id === "seven-tail-d" ? target.targetNumbers.includes(nextSpecial) : !target.targetNumbers.includes(nextSpecial);
            return {
                currentIssue: draw.issue,
                currentNumbers,
                variables: formula.variables,
                expression: formula.expression,
                rawResult: formula.value,
                ...target,
                nextIssue: nextDraw?.issue,
                nextSpecial,
                nextZodiac: nextSpecial ? (0,engine_attributes/* getNumberAttributes */.hJ)(nextSpecial, config).zodiac : undefined,
                success
            };
        } catch (error) {
            return {
                currentIssue: draw.issue,
                currentNumbers,
                variables: {},
                expression: spec.formula,
                rawResult: 0,
                normalizedValue: 0,
                normalizerSteps: [],
                targetLabels: [],
                targetNumbers: [],
                ambiguous: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    });
    const resolved = details.filter((detail)=>typeof detail.success === "boolean");
    const success = resolved.filter((detail)=>detail.success).length;
    const recent = resolved.slice(-10);
    const recentSuccess = recent.filter((detail)=>detail.success).length;
    const streaks = streakSummary(details);
    const scenarios = spec.id.startsWith("half-head") ? [
        scenarioSummary(details, 0, "结果6按3头单"),
        scenarioSummary(details, 1, "结果6按2头双")
    ] : [];
    return {
        spec,
        total: resolved.length,
        success,
        failed: resolved.length - success,
        successRate: special_analysis_rate(success, resolved.length),
        recentTotal: recent.length,
        recentSuccess,
        recentRate: special_analysis_rate(recentSuccess, recent.length),
        ...streaks,
        wrongIssues: resolved.filter((detail)=>!detail.success).map((detail)=>detail.nextIssue ?? detail.currentIssue),
        ambiguousCount: details.filter((detail)=>detail.ambiguous && detail.nextSpecial !== undefined).length,
        scenarios,
        details
    };
}
function stateFor(number, kind) {
    if (kind === "size") return number >= 25 ? 0 : 1;
    return number % 2 === 1 ? 0 : 1;
}
function labelsFor(kind) {
    return kind === "size" ? [
        "大",
        "小"
    ] : [
        "单",
        "双"
    ];
}
function boundedProbability(value) {
    return Math.min(0.95, Math.max(0.05, value));
}
function frequencyProbability(states, window) {
    const sample = states.slice(-window);
    if (!sample.length) return 0.5;
    return (sample.filter((state)=>state === 0).length + 1) / (sample.length + 2);
}
function recencyProbability(states) {
    const sample = states.slice(-40);
    if (!sample.length) return 0.5;
    let zeroWeight = 1;
    let totalWeight = 2;
    sample.forEach((state, index)=>{
        const weight = 0.88 ** (sample.length - index - 1);
        totalWeight += weight;
        if (state === 0) zeroWeight += weight;
    });
    return zeroWeight / totalWeight;
}
function patternProbability(states, order) {
    if (states.length <= order) return frequencyProbability(states, 30);
    const pattern = states.slice(-order);
    let zero = 1;
    let one = 1;
    for(let index = order; index < states.length; index += 1){
        let matches = true;
        for(let offset = 0; offset < order; offset += 1){
            if (states[index - order + offset] !== pattern[offset]) {
                matches = false;
                break;
            }
        }
        if (!matches) continue;
        if (states[index] === 0) zero += 1;
        else one += 1;
    }
    return zero / (zero + one);
}
function currentRunLength(states) {
    const current = states.at(-1);
    if (current === undefined) return 0;
    let length = 0;
    for(let index = states.length - 1; index >= 0 && states[index] === current; index -= 1)length += 1;
    return length;
}
function streakProbability(states) {
    const current = states.at(-1);
    if (current === undefined) return 0.5;
    const targetRun = Math.min(currentRunLength(states), 4);
    let zero = 1;
    let one = 1;
    for(let nextIndex = 1; nextIndex < states.length; nextIndex += 1){
        if (states[nextIndex - 1] !== current) continue;
        let run = 0;
        for(let index = nextIndex - 1; index >= 0 && states[index] === current; index -= 1)run += 1;
        if (Math.min(run, 4) !== targetRun) continue;
        if (states[nextIndex] === 0) zero += 1;
        else one += 1;
    }
    return zero / (zero + one);
}
const TREND_MODELS = [
    {
        label: "近10期",
        predict: (states)=>frequencyProbability(states, 10)
    },
    {
        label: "近20期",
        predict: (states)=>frequencyProbability(states, 20)
    },
    {
        label: "近30期",
        predict: (states)=>frequencyProbability(states, 30)
    },
    {
        label: "时间衰减",
        predict: recencyProbability
    },
    {
        label: "一阶走势",
        predict: (states)=>patternProbability(states, 1)
    },
    {
        label: "二阶走势",
        predict: (states)=>patternProbability(states, 2)
    },
    {
        label: "三阶走势",
        predict: (states)=>patternProbability(states, 3)
    },
    {
        label: "连开状态",
        predict: streakProbability
    }
];
function learnedTrendProbability(states) {
    if (!states.length) {
        return {
            probabilities: [
                0.5,
                0.5
            ],
            weights: TREND_MODELS.map((model)=>({
                    label: model.label,
                    weight: 1 / TREND_MODELS.length
                })),
            trainingSamples: 0
        };
    }
    const losses = TREND_MODELS.map(()=>0);
    const startIndex = Math.max(8, states.length - 80);
    let trainingSamples = 0;
    for(let targetIndex = startIndex; targetIndex < states.length; targetIndex += 1){
        const history = states.slice(0, targetIndex);
        TREND_MODELS.forEach((model, modelIndex)=>{
            const predictedZero = boundedProbability(model.predict(history));
            const actualZero = states[targetIndex] === 0 ? 1 : 0;
            losses[modelIndex] += (predictedZero - actualZero) ** 2;
        });
        trainingSamples += 1;
    }
    const rawWeights = losses.map((loss)=>Math.exp(-6 * (trainingSamples ? loss / trainingSamples : 0.25)));
    const weightTotal = rawWeights.reduce((sum, weight)=>sum + weight, 0) || 1;
    const weights = TREND_MODELS.map((model, index)=>({
            label: model.label,
            weight: rawWeights[index] / weightTotal
        }));
    const probabilityZero = boundedProbability(TREND_MODELS.reduce((sum, model, index)=>sum + boundedProbability(model.predict(states)) * weights[index].weight, 0));
    return {
        probabilities: [
            probabilityZero,
            1 - probabilityZero
        ],
        weights,
        trainingSamples
    };
}
function analyzeBinaryTrend(draws, kind) {
    const labels = labelsFor(kind);
    const states = special_analysis_sortDraws(draws).map((draw)=>stateFor(draw.special, kind));
    const recent30 = states.slice(-30);
    const learned = learnedTrendProbability(states);
    const probabilities = learned.probabilities;
    let backtestTotal = 0;
    let backtestSuccess = 0;
    for(let index = Math.max(20, states.length - 100); index < states.length; index += 1){
        const model = learnedTrendProbability(states.slice(0, index)).probabilities;
        const prediction = model[0] >= model[1] ? 0 : 1;
        backtestTotal += 1;
        if (prediction === states[index]) backtestSuccess += 1;
    }
    const current = states.at(-1);
    let currentStreak = 0;
    if (current !== undefined) {
        for(let index = states.length - 1; index >= 0; index -= 1){
            if (states[index] !== current) break;
            currentStreak += 1;
        }
    }
    return {
        kind,
        title: kind === "size" ? "特码大小走势" : "特码单双走势",
        labels,
        sequence20: states.slice(-20).map((state)=>labels[state]),
        sequence30: recent30.map((state)=>labels[state]),
        currentLabel: current === undefined ? "-" : labels[current],
        currentStreak,
        probabilities: [
            {
                label: labels[0],
                probability: Number((probabilities[0] * 100).toFixed(2))
            },
            {
                label: labels[1],
                probability: Number((probabilities[1] * 100).toFixed(2))
            }
        ],
        backtestTotal,
        backtestSuccess,
        backtestRate: special_analysis_rate(backtestSuccess, backtestTotal),
        trainingSamples: learned.trainingSamples,
        confidence: Number((Math.abs(probabilities[0] - probabilities[1]) * 100).toFixed(2)),
        modelWeights: learned.weights.map((item)=>({
                label: item.label,
                weight: Number((item.weight * 100).toFixed(1))
            })).sort((a, b)=>b.weight - a.weight),
        explanation: "自适应模型会从历史数据学习近期频率、时间衰减、1至3阶走势和连开状态，并按滚动预测误差自动调整各模型权重；不是固定格式，仅用于走势研究。"
    };
}

;// ./src/components/special-analysis-view.tsx
/* __next_internal_client_entry_do_not_use__ SpecialAnalysisView auto */ 









function numberLabel(number, config) {
    const zodiac = (0,engine_attributes/* getNumberAttributes */.hJ)(number, config).zodiac;
    return `${String(number).padStart(2, "0")} ${zodiac}`;
}
function ZodiacNumberNineGrid({ draws, config }) {
    const triggers = (0,react.useMemo)(()=>buildPositionNineGridTriggers(draws), [
        draws
    ]);
    const [selectedIssue, setSelectedIssue] = (0,react.useState)("");
    const selected = triggers.find((trigger)=>trigger.triggerDraw.issue === selectedIssue) ?? triggers[0];
    if (!selected) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
            className: "p-4 sm:p-5",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                    tone: "cyan",
                    children: "位置触发九宫格"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                    className: "mt-3 font-semibold text-white",
                    children: "当前开奖记录中还没有找到触发期"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "mt-1 text-sm leading-6 text-slate-400",
                    children: "当上期的特码再次出现在下一期的平1至平6或特码位置时，系统会自动生成三期三列九宫格。"
                })
            ]
        });
    }
    const positionLabel = DRAW_POSITION_LABELS[selected.positionIndex];
    const previousSpecialZodiac = (0,engine_attributes/* getNumberAttributes */.hJ)(selected.previousSpecial, config).zodiac;
    const rows = [
        {
            label: "上一期",
            draw: selected.previousDraw
        },
        {
            label: "触发期",
            draw: selected.triggerDraw
        },
        {
            label: "下一期",
            draw: selected.nextDraw
        }
    ];
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "cyan",
                                        children: "位置触发九宫格"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "yellow",
                                        children: "肖码同格"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "mt-3 font-semibold text-white",
                                children: "上期的特码出现在本期哪个位置，就围绕该位置取三列"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 max-w-3xl text-xs leading-5 text-slate-500",
                                children: "平1取平1、平2、平3；特码取平5、平6、特码；中间位置取前一列、本列、后一列。触发期固定显示在九宫格中间一行。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                        className: "w-full lg:w-72",
                        value: selected.triggerDraw.issue,
                        onChange: (event)=>setSelectedIssue(event.target.value),
                        "aria-label": "选择九宫格触发期",
                        children: triggers.map((trigger)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("option", {
                                value: trigger.triggerDraw.issue,
                                children: [
                                    trigger.triggerDraw.issue,
                                    "期 \xb7 上期特码在",
                                    DRAW_POSITION_LABELS[trigger.positionIndex]
                                ]
                            }, trigger.triggerDraw.issue))
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 rounded-lg border border-white/[0.08] bg-black/15 p-3 sm:p-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-col gap-2 border-b border-white/[0.07] pb-3 sm:flex-row sm:items-center sm:justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "font-medium text-white",
                                        children: [
                                            selected.previousDraw.issue,
                                            "期特码 ",
                                            numberLabel(selected.previousSpecial, config),
                                            "，在 ",
                                            selected.triggerDraw.issue,
                                            "期出现在",
                                            positionLabel
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-1 text-xs text-slate-500",
                                        children: [
                                            "当前显示第 ",
                                            selected.columnIndexes[0] + 1,
                                            " 至第 ",
                                            selected.columnIndexes[2] + 1,
                                            " 列位置窗口，共找到 ",
                                            triggers.length,
                                            " 次历史触发。"
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "cyan",
                                children: [
                                    "触发：",
                                    String(selected.previousSpecial).padStart(2, "0"),
                                    " ",
                                    previousSpecialZodiac
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 grid grid-cols-[56px_repeat(3,minmax(0,1fr))] gap-2 sm:grid-cols-[76px_repeat(3,minmax(0,1fr))]",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {}),
                            selected.columnIndexes.map((columnIndex)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: "flex min-h-9 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.035] px-1 text-center text-xs font-medium text-slate-300",
                                    children: DRAW_POSITION_LABELS[columnIndex]
                                }, columnIndex)),
                            rows.map((row, rowIndex)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "contents",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                            className: cn("flex min-h-24 items-center justify-center rounded-md border px-1 text-center text-[11px] font-medium leading-4 sm:text-xs", rowIndex === 1 ? "border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-100" : "border-white/[0.07] bg-white/[0.025] text-slate-400"),
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                children: [
                                                    row.label,
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                    row.draw?.issue.slice(-3) ?? "待定",
                                                    "期"
                                                ]
                                            })
                                        }),
                                        selected.columnIndexes.map((columnIndex)=>{
                                            const number = row.draw ? drawNumbers(row.draw)[columnIndex] : undefined;
                                            const attributes = number ? (0,engine_attributes/* getNumberAttributes */.hJ)(number, config) : undefined;
                                            const isAnchor = rowIndex === 1 && columnIndex === selected.positionIndex;
                                            return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: cn("flex min-h-24 min-w-0 flex-col items-center justify-center rounded-md border p-1.5 text-center sm:p-2", isAnchor ? "border-amber-200/60 bg-amber-300/14 text-amber-50 shadow-[0_0_26px_rgba(251,191,36,0.10)]" : rowIndex === 1 ? "border-cyan-300/24 bg-cyan-300/[0.07] text-cyan-50" : "border-white/[0.08] bg-black/20 text-slate-200"),
                                                children: number && attributes ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                                            className: "text-lg tabular-nums sm:text-xl",
                                                            children: String(number).padStart(2, "0")
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                            className: "mt-1 text-xs font-medium",
                                                            children: attributes.zodiac
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                            className: "mt-0.5 text-[10px] text-slate-500",
                                                            children: [
                                                                attributes.color,
                                                                isAnchor ? " · 上期特码" : ""
                                                            ]
                                                        })
                                                    ]
                                                }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                    className: "text-xs leading-5 text-slate-500",
                                                    children: [
                                                        "等待",
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                        "下一期开奖"
                                                    ]
                                                })
                                            }, columnIndex);
                                        })
                                    ]
                                }, row.label))
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 grid grid-cols-1 gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-md border border-white/[0.07] bg-white/[0.025] px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        className: "text-slate-200",
                                        children: "在平1："
                                    }),
                                    "取平1、平2、平3"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-md border border-white/[0.07] bg-white/[0.025] px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        className: "text-slate-200",
                                        children: "在中间："
                                    }),
                                    "取前一列、本列、后一列"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-md border border-white/[0.07] bg-white/[0.025] px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        className: "text-slate-200",
                                        children: "在特码："
                                    }),
                                    "取平5、平6、特码"
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function Metric({ label, value, tone = "default" }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: cn("min-w-0 rounded-lg border p-4", tone === "good" && "border-emerald-300/20 bg-emerald-300/[0.07]", tone === "bad" && "border-rose-300/20 bg-rose-300/[0.07]", tone === "warn" && "border-amber-300/20 bg-amber-300/[0.07]", tone === "default" && "border-white/[0.08] bg-white/[0.035]"),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "text-xs text-slate-500",
                children: label
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-2 break-words text-[24px] font-semibold leading-none text-white tabular-nums",
                children: value
            })
        ]
    });
}
function ResultBoard({ detail }) {
    if (!detail) return null;
    const active = detail.normalizedValue;
    const isHalfHead = detail.targetLabels.some((label)=>label.includes("头"));
    const isSevenTail = detail.targetLabels.some((label)=>label.startsWith("七尾"));
    const isElement = detail.targetLabels.some((label)=>label.endsWith("行"));
    const sevenTailValues = isSevenTail ? detail.targetLabels[0].replace(/^七尾\s*/, "").split("、").map(Number) : [];
    const cells = isHalfHead ? [
        {
            value: 1,
            label: "0头单"
        },
        {
            value: 2,
            label: "0头双"
        },
        {
            value: 3,
            label: "1头单"
        },
        {
            value: 4,
            label: "1头双"
        },
        {
            value: 5,
            label: "2头单"
        },
        {
            value: 6,
            label: "两种解释"
        },
        {
            value: 7,
            label: "原文未定义"
        },
        {
            value: 8,
            label: "3头双"
        },
        {
            value: 9,
            label: "4头单"
        },
        {
            value: 0,
            label: "4头双"
        }
    ] : isSevenTail ? Array.from({
        length: 10
    }, (_, value)=>({
            value,
            label: sevenTailValues.includes(value) ? "入选" : "未选"
        })) : isElement ? [
        "金",
        "木",
        "水",
        "火",
        "土"
    ].map((label, index)=>({
            value: index + 1,
            label: `${label}行`
        })) : detail.targetLabels[0]?.includes("波") ? [
        {
            value: 0,
            label: "红波"
        },
        {
            value: 1,
            label: "蓝波"
        },
        {
            value: 2,
            label: "绿波"
        }
    ] : [
        1,
        2,
        3,
        4,
        5
    ].map((value)=>({
            value,
            label: `${value}门`
        }));
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: cn("grid gap-2", isHalfHead || isSevenTail ? "grid-cols-2 sm:grid-cols-5" : cells.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-5"),
        children: cells.map((cell)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: cn("flex min-h-20 min-w-0 flex-col items-center justify-center rounded-md border p-2 text-center transition", !isSevenTail && active === cell.value && "border-cyan-200/60 bg-cyan-300/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)]", isSevenTail && sevenTailValues.includes(cell.value) && "border-cyan-200/60 bg-cyan-300/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)]", isSevenTail && active === cell.value && !sevenTailValues.includes(cell.value) && "border-amber-200/50 bg-amber-300/10 text-amber-50", active !== cell.value && !(isSevenTail && sevenTailValues.includes(cell.value)) && "border-white/[0.08] bg-black/20 text-slate-400", cell.value === 6 && isHalfHead && "border-amber-300/30"),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        className: "text-xl tabular-nums",
                        children: cell.value
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "mt-1 text-[11px] leading-4",
                        children: cell.label
                    })
                ]
            }, cell.value))
    });
}
function TrendCard({ report }) {
    const top = [
        ...report.probabilities
    ].sort((a, b)=>b.probability - a.probability)[0];
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-wrap items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: report.title
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-xs leading-5 text-slate-500",
                                children: report.explanation
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        tone: report.backtestRate >= 55 ? "green" : "yellow",
                        children: [
                            "滚动验证 ",
                            report.backtestRate,
                            "%"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 grid grid-cols-2 gap-3",
                children: report.probabilities.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: cn("rounded-lg border p-4", item.label === top.label ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/[0.08] bg-white/[0.03]"),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "text-sm text-slate-400",
                                children: [
                                    "下一期参考：",
                                    item.label
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-2 text-[28px] font-semibold text-white tabular-nums",
                                children: [
                                    item.probability,
                                    "%"
                                ]
                            })
                        ]
                    }, item.label))
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 flex flex-wrap gap-2",
                children: report.sequence20.map((item, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: cn("flex h-8 w-8 items-center justify-center rounded-md border text-xs", item === report.labels[0] ? "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100" : "border-violet-300/20 bg-violet-300/[0.08] text-violet-100"),
                        children: item
                    }, `${item}-${index}`))
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-3 flex flex-wrap gap-2",
                children: report.modelWeights.slice(0, 3).map((model)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        tone: "slate",
                        children: [
                            model.label,
                            " ",
                            model.weight,
                            "%"
                        ]
                    }, model.label))
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "mt-3 text-xs leading-5 text-slate-500",
                children: [
                    "最近20期 \xb7 当前连续 ",
                    report.currentLabel,
                    " ",
                    report.currentStreak,
                    " 期 \xb7 学习样本 ",
                    report.trainingSamples,
                    " 期 \xb7 概率差 ",
                    report.confidence,
                    "% \xb7 历史滚动验证 ",
                    report.backtestSuccess,
                    "/",
                    report.backtestTotal
                ]
            })
        ]
    });
}
function DetailRow({ detail, config }) {
    const [open, setOpen] = (0,react.useState)(false);
    const status = detail.error ? "error" : detail.ambiguous ? "ambiguous" : detail.success === undefined ? "pending" : detail.success ? "success" : "failed";
    const outputVerb = detail.targetLabels.some((label)=>label.startsWith("七尾")) ? "参考" : "杀";
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: cn("rounded-lg border p-3 sm:p-4", status === "success" && "border-emerald-300/20 bg-emerald-300/[0.055]", status === "failed" && "border-rose-300/28 bg-rose-300/[0.075]", status === "ambiguous" && "border-amber-300/25 bg-amber-300/[0.06]", (status === "pending" || status === "error") && "border-white/[0.08] bg-white/[0.03]"),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                type: "button",
                className: "grid w-full grid-cols-1 gap-3 text-left md:grid-cols-[120px_1fr_180px_32px] md:items-center",
                onClick: ()=>setOpen((value)=>!value),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "font-semibold text-white tabular-nums",
                                children: [
                                    detail.currentIssue,
                                    "期"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: "计算期"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "break-words text-sm text-slate-200",
                                children: [
                                    "原始 ",
                                    detail.rawResult,
                                    " → ",
                                    detail.normalizerSteps.join(" → "),
                                    " → ",
                                    outputVerb,
                                    " ",
                                    detail.targetLabels.join(" / ") || "未定义"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 break-words text-xs text-slate-500",
                                children: detail.currentNumbers.map((number)=>numberLabel(number, config)).join("  ")
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2 md:justify-end",
                        children: [
                            status === "success" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                                        className: "h-4 w-4 text-emerald-300"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm text-emerald-100",
                                        children: [
                                            detail.nextIssue,
                                            " 开 ",
                                            detail.nextSpecial ? numberLabel(detail.nextSpecial, config) : "-",
                                            "，正确"
                                        ]
                                    })
                                ]
                            }),
                            status === "failed" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_x/* default */.A, {
                                        className: "h-4 w-4 text-rose-300"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-sm text-rose-100",
                                        children: [
                                            detail.nextIssue,
                                            " 开 ",
                                            detail.nextSpecial ? numberLabel(detail.nextSpecial, config) : "-",
                                            "，错误"
                                        ]
                                    })
                                ]
                            }),
                            status === "ambiguous" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(triangle_alert/* default */.A, {
                                        className: "h-4 w-4 text-amber-300"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "text-sm text-amber-100",
                                        children: "结果6待确认"
                                    })
                                ]
                            }),
                            status === "pending" && /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                tone: "slate",
                                children: "等待下一期"
                            }),
                            status === "error" && /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                tone: "rose",
                                children: "计算异常"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(chevron_down/* default */.A, {
                        className: cn("h-4 w-4 text-slate-500 transition", open && "rotate-180")
                    })
                ]
            }),
            open && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid gap-3 border-t border-white/[0.08] pt-4 text-xs sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.06] bg-black/20 p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "变量取值"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 break-words leading-6 text-slate-200",
                                children: Object.entries(detail.variables).map(([key, value])=>`${key}=${value}`).join("；") || "无"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.06] bg-black/20 p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "排除号码"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 break-words leading-6 text-slate-200",
                                children: detail.targetNumbers.map((number)=>numberLabel(number, config)).join("、") || "待确认"
                            })
                        ]
                    }),
                    detail.error && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-rose-200 sm:col-span-2",
                        children: detail.error
                    })
                ]
            })
        ]
    });
}
function SpecialAnalysisView({ draws, config, dataSourceLabel, sourceLoading, onSync }) {
    const [selectedId, setSelectedId] = (0,react.useState)("kill-color");
    const [visibleCount, setVisibleCount] = (0,react.useState)(30);
    const report = (0,react.useMemo)(()=>analyzeSpecialRule(selectedId, draws, config), [
        selectedId,
        draws,
        config
    ]);
    const sizeTrend = (0,react.useMemo)(()=>analyzeBinaryTrend(draws, "size"), [
        draws
    ]);
    const parityTrend = (0,react.useMemo)(()=>analyzeBinaryTrend(draws, "parity"), [
        draws
    ]);
    const latest = report.details.at(-1);
    const visibleDetails = report.details.slice(-visibleCount).reverse();
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
                className: "p-4 sm:p-5",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                            tone: "cyan",
                                            children: "独立观察窗口"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                            tone: "green",
                                            children: [
                                                draws.length,
                                                "期真实数据"
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                    className: "mt-3 text-xl font-semibold text-white",
                                    children: "专项规则概率观察"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-2 max-w-4xl text-sm leading-6 text-slate-500",
                                    children: "单独检查杀半头、杀一波、杀一门和二分类走势。这里不会自动混入综合推荐；先把规则解释和历史表现看清楚，再决定是否正式入库。"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                    tone: "slate",
                                    children: [
                                        "数据来源：",
                                        dataSourceLabel
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                    variant: "primary",
                                    disabled: sourceLoading,
                                    onClick: onSync,
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                            className: cn("h-4 w-4", sourceLoading && "animate-spin")
                                        }),
                                        sourceLoading ? "同步中" : "同步最新开奖"
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ZodiacNumberNineGrid, {
                draws: draws,
                config: config
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "grid grid-cols-2 gap-2 lg:grid-cols-6",
                children: SPECIAL_RULE_SPECS.map((spec)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                        type: "button",
                        onClick: ()=>{
                            setSelectedId(spec.id);
                            setVisibleCount(30);
                        },
                        className: cn("min-h-20 rounded-lg border p-3 text-left transition", selectedId === spec.id ? "border-cyan-300/40 bg-cyan-300/12" : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.055]"),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "font-medium text-white",
                                children: spec.name
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 line-clamp-2 text-xs leading-5 text-slate-500",
                                children: spec.formula
                            })
                        ]
                    }, spec.id))
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-4 sm:p-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "font-semibold text-white",
                                        children: report.spec.name
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 text-sm text-slate-400",
                                        children: report.spec.formula
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 text-xs text-slate-500",
                                        children: report.spec.explanation
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "cyan",
                                children: [
                                    report.spec.orderMode,
                                    "序"
                                ]
                            })
                        ]
                    }),
                    (selectedId === "half-head-l" || selectedId === "half-head-d") && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-3 text-sm leading-6 text-amber-100",
                        children: "原文把结果 6 同时写成“3头单”和“2头双”，并且没有写结果 7 的映射。主成功率暂不计算这些期，下面同时给出结果6两种解释的独立概率，避免系统乱猜。"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "有效验证",
                                value: `${report.total}期`
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "正确",
                                value: report.success,
                                tone: "good"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "错误",
                                value: report.failed,
                                tone: "bad"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "历史成功率",
                                value: `${report.successRate}%`,
                                tone: report.successRate >= 70 ? "good" : "warn"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "最近10期",
                                value: `${report.recentSuccess}/${report.recentTotal}`
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                label: "当前状态",
                                value: report.currentStreakType === "none" ? "暂无" : `${report.currentStreakType === "success" ? "连对" : "连错"}${report.currentStreak}期`,
                                tone: report.currentStreakType === "failed" ? "bad" : "good"
                            })
                        ]
                    }),
                    report.scenarios.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 grid gap-3 sm:grid-cols-2",
                        children: report.scenarios.map((scenario)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-lg border border-amber-300/15 bg-amber-300/[0.045] p-3 text-sm text-amber-50",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        children: scenario.label
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "ml-3 tabular-nums",
                                        children: [
                                            scenario.success,
                                            "/",
                                            scenario.total,
                                            " \xb7 ",
                                            scenario.rate,
                                            "%"
                                        ]
                                    })
                                ]
                            }, scenario.label))
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-4 sm:p-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "最新一期计算图"
                            }),
                            latest ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                                label: "使用期号",
                                                value: latest.currentIssue
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                                label: "原始结果",
                                                value: latest.rawResult
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                                label: "归一化结果",
                                                value: latest.normalizedValue
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Metric, {
                                                label: "最终输出",
                                                value: `${selectedId === "seven-tail-d" ? "参考" : "杀"} ${latest.targetLabels.join(" / ") || "待确认"}`,
                                                tone: latest.ambiguous ? "warn" : "good"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "mt-4",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ResultBoard, {
                                            detail: latest
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "mt-4 rounded-lg border border-white/[0.08] bg-black/20 p-3 text-sm leading-6 text-slate-300",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                children: Object.entries(latest.variables).map(([key, value])=>`${key}=${value}`).join("；")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-1 text-slate-500",
                                                children: [
                                                    "计算：",
                                                    latest.rawResult,
                                                    " → ",
                                                    latest.normalizerSteps.join(" → "),
                                                    " → ",
                                                    latest.targetLabels.join(" / ")
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-4 text-sm text-slate-500",
                                children: "暂无开奖数据。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-4 sm:p-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "明确错期"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: "显示被杀中的下一期开奖期号。"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto pr-1",
                                children: [
                                    report.wrongIssues.map((issue)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                            tone: "rose",
                                            children: issue
                                        }, issue)),
                                    !report.wrongIssues.length && /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "green",
                                        children: "当前没有错误记录"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-slate-300",
                                children: [
                                    "最大连对：",
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("strong", {
                                        className: "ml-1 text-white",
                                        children: [
                                            report.maxSuccessStreak,
                                            "期"
                                        ]
                                    }),
                                    report.ambiguousCount > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-2 text-amber-200",
                                        children: [
                                            "另有 ",
                                            report.ambiguousCount,
                                            " 期结果为6，等待确认映射。"
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "grid grid-cols-1 gap-4 xl:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(TrendCard, {
                        report: sizeTrend
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(TrendCard, {
                        report: parityTrend
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-4 sm:p-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap items-end justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        className: "font-semibold text-white",
                                        children: "逐期计算流水账"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 text-xs text-slate-500",
                                        children: "每一期变量、计算、输出、下一期开奖和对错都可以展开检查。"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "slate",
                                children: [
                                    "显示 ",
                                    Math.min(visibleCount, report.details.length),
                                    "/",
                                    report.details.length
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 space-y-3",
                        children: visibleDetails.map((detail)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(DetailRow, {
                                detail: detail,
                                config: config
                            }, detail.currentIssue))
                    }),
                    report.details.length > visibleCount && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 flex justify-center",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                            onClick: ()=>setVisibleCount((count)=>count + 30),
                            children: "加载更早30期"
                        })
                    })
                ]
            })
        ]
    });
}

;// ./src/components/rulequant-terminal.tsx
/* provided dependency */ var rulequant_terminal_process = __webpack_require__(9730);
/* __next_internal_client_entry_do_not_use__ RuleQuantTerminal auto */ 


























let exportersPromise;
function importExporters() {
    return __webpack_require__.e(/* import() */ 686).then(__webpack_require__.bind(__webpack_require__, 9686));
}
function loadExporters() {
    exportersPromise ??= importExporters();
    return exportersPromise;
}
function exportJson(data, filename) {
    void loadExporters().then((module)=>module.exportJson(data, filename));
}
function exportDrawsCsv(draws) {
    void loadExporters().then((module)=>module.exportDrawsCsv(draws));
}
function exportWorkbook(sheets, filename) {
    void loadExporters().then((module)=>module.exportWorkbook(sheets, filename));
}
function exportBacktestExcel(result) {
    void loadExporters().then((module)=>module.exportBacktestExcel(result));
}
function exportSampleReport(results) {
    void loadExporters().then((module)=>module.exportSampleReport(results));
}
function exportCandidatePoolExcel(report) {
    void loadExporters().then((module)=>module.exportCandidatePoolExcel(report));
}
function exportCandidatePoolHtml(report) {
    void loadExporters().then((module)=>module.exportCandidatePoolHtml(report));
}
function exportReferenceHistoryExcel(records) {
    void loadExporters().then((module)=>module.exportReferenceHistoryExcel(records));
}
function exportReferenceHistoryText(records) {
    void loadExporters().then((module)=>module.exportReferenceHistoryText(records));
}
function exportReferenceHistoryWord(records) {
    void loadExporters().then((module)=>module.exportReferenceHistoryWord(records));
}
function exportHtmlReport(result, rules, config) {
    void loadExporters().then((module)=>module.exportHtmlReport(result, rules, config));
}
const navItems = [
    {
        key: "dashboard",
        href: "/dashboard",
        label: "首页",
        icon: gauge/* default */.A
    },
    {
        key: "one-click",
        href: "/one-click",
        label: "一键算公式",
        icon: play/* default */.A
    },
    {
        key: "candidate-pool",
        href: "/candidate-pool",
        label: "综合参考结果",
        icon: activity/* default */.A
    },
    {
        key: "special-analysis",
        href: "/special-analysis",
        label: "专项概率观察",
        icon: chart_column/* default */.A
    },
    {
        key: "draws",
        href: "/draws",
        label: "开奖数据",
        icon: table_properties/* default */.A
    },
    {
        key: "rules",
        href: "/rules",
        label: "公式管理",
        icon: icons_layers/* default */.A
    },
    {
        key: "sample-check",
        href: "/sample-check",
        label: "公式校验",
        icon: clipboard_check/* default */.A
    },
    {
        key: "formula-discovery",
        href: "/formula-discovery",
        label: "公式筛选",
        icon: search/* default */.A
    },
    {
        key: "config",
        href: "/config",
        label: "设置",
        icon: settings_2/* default */.A
    }
];
const mobileNavKeys = [
    "dashboard",
    "one-click",
    "candidate-pool",
    "rules"
];
const mobileNavItems = navItems.filter((item)=>mobileNavKeys.includes(item.key));
const REMOTE_DRAW_IMPORT_ENDPOINT = "https://rulequant-terminal.vercel.app/api/import-draws-from-url";
const AUTO_SYNC_INTERVAL_MS = 10 * 60 * 1000;
const MANUAL_DRAW_KEYS = [
    "n1",
    "n2",
    "n3",
    "n4",
    "n5",
    "n6",
    "special"
];
function staticCloudStateUrls() {
    const basePath = "/rulequant-terminal-pages" ?? 0;
    if ( true && window.location.hostname.endsWith("github.io") && basePath) {
        return [
            `${basePath}/static-cloud-state.json`
        ];
    }
    return Array.from(new Set([
        basePath ? `${basePath}/static-cloud-state.json` : "",
        "/static-cloud-state.json",
        "../static-cloud-state.json"
    ].filter(Boolean)));
}
const viewLabels = {
    dashboard: "首页",
    "one-click": "一键算公式",
    "formula-detail": "公式逐期明细",
    "formula-discovery": "公式筛选",
    "special-analysis": "专项概率观察",
    draws: "开奖数据",
    import: "数据导入",
    rules: "公式管理",
    "formula-editor": "新增规则",
    backtest: "高级回测",
    "candidate-pool": "综合参考结果",
    "next-output": "单期输出",
    "sample-check": "公式校验",
    config: "设置",
    reports: "导出报告",
    help: "规则理解"
};
const categories = [
    {
        value: "include_zodiac",
        label: "选生肖"
    },
    {
        value: "kill_zodiac",
        label: "杀一肖"
    },
    {
        value: "kill_color",
        label: "杀波色"
    },
    {
        value: "include_color",
        label: "参考波色"
    },
    {
        value: "kill_parity",
        label: "杀单双"
    },
    {
        value: "include_parity",
        label: "参考单双"
    },
    {
        value: "kill_size",
        label: "杀大小"
    },
    {
        value: "include_size",
        label: "参考大小"
    },
    {
        value: "kill_sum",
        label: "杀一合"
    },
    {
        value: "kill_tail",
        label: "杀一尾"
    },
    {
        value: "kill_head",
        label: "杀一头"
    },
    {
        value: "kill_element",
        label: "杀一行"
    },
    {
        value: "kill_segment",
        label: "杀一段"
    },
    {
        value: "seven_tail",
        label: "七尾"
    },
    {
        value: "six_zodiac",
        label: "取六肖"
    },
    {
        value: "eight_zodiac",
        label: "八肖"
    },
    {
        value: "eight_zodiac_two_period",
        label: "八肖管两期"
    },
    {
        value: "nine_zodiac",
        label: "九肖"
    },
    {
        value: "kill_three_as_nine",
        label: "杀三肖 / 九肖"
    },
    {
        value: "custom_set",
        label: "自定义集合"
    }
];
const sourceTypeOptions = [
    {
        value: "user_provided",
        label: "用户提供公式"
    },
    {
        value: "system_recommended",
        label: "系统推荐公式"
    },
    {
        value: "manual",
        label: "人工新增公式"
    },
    {
        value: "example",
        label: "示例公式"
    }
];
const extendedSourceTypeOptions = [
    ...sourceTypeOptions,
    {
        value: "txt_import",
        label: "TXT 导入公式"
    },
    {
        value: "copied",
        label: "复制公式"
    }
];
function sourceTypeLabel(sourceType) {
    if (sourceType === "txt_import") return "TXT 导入公式";
    if (sourceType === "copied") return "复制公式";
    return sourceTypeOptions.find((item)=>item.value === (sourceType ?? "user_provided"))?.label ?? "用户提供公式";
}
function sourceTypeTone(sourceType) {
    switch(sourceType ?? "user_provided"){
        case "user_provided":
            return "green";
        case "system_recommended":
            return "violet";
        case "manual":
            return "cyan";
        case "txt_import":
            return "yellow";
        case "copied":
            return "green";
        case "example":
            return "slate";
    }
}
const rawRuleFiles = [
    "D序，杀一肖（截止163期，327错8）.txt",
    "D序杀规1（176错3）都是截止156期的数据。红=00蓝=01绿=0(1).txt",
    "L序杀肖一肖规7(1).txt",
    "L序杀肖一肖规8.txt",
    "L序杀一头规.txt",
    "L序杀一行规公式.txt",
    "澳门规：.txt",
    "澳门规1：(1).txt",
    "澳门杀一段规，要的拿走。.txt",
    "澳门杀一段规，要的拿走1。.txt",
    "澳门杀一肖规，共10条.txt",
    "八肖管理两期(此规管2期的。).txt",
    "八肖自用、、(2个括号内的肖都是括号前的肖的对冲+123456。取值123.txt",
    "九肖、、(2个括号内的肖都是括号前的肖的对冲+123456。取值123.txt",
    "九肖自用、、(3个括号内的肖都是括号前的肖的对冲+123456。取值123.txt",
    "杀三肖可以当做九肖用、、20260606、、(取值平7654321.23456.7654321.23456.).txt",
    "单双自用、、20260625、、取值4455(1).txt",
    "澳门七尾规公式2：.txt",
    "杀一肖规，共10条.txt",
    "一条L序杀合数规.txt",
    "最后再给大家一条L序杀合数规.txt"
];
const EMPTY_CANDIDATE_REPORT = {
    generatedAt: "",
    latestNumbers: [],
    ruleCount: 0,
    signalCount: 0,
    signals: [],
    allNumbers: [],
    allZodiacs: [],
    topNumbers8: [],
    topNumbers12: [],
    topNumbers16: [],
    topNumbers18: [],
    topZodiacs7: [],
    topZodiacs8: [],
    topZodiacs9: [],
    riskNotice: ""
};
const EMPTY_BACKTEST = {
    generatedAt: "",
    ruleResults: []
};
const EMPTY_REFERENCE_OBSERVATION = {
    window: 10,
    total: 0,
    top8Hits: 0,
    top12Hits: 0,
    top18Hits: 0,
    zodiac7Hits: 0,
    zodiac9Hits: 0,
    top8Rate: 0,
    top12Rate: 0,
    top18Rate: 0,
    zodiac7Rate: 0,
    zodiac9Rate: 0,
    items: []
};
const WEBSITE_FIRST_VIEWS = new Set([
    "dashboard",
    "one-click",
    "formula-detail",
    "formula-discovery",
    "special-analysis",
    "sample-check",
    "backtest",
    "rules",
    "formula-editor",
    "candidate-pool",
    "draws",
    "import",
    "next-output",
    "config",
    "help",
    "reports"
]);
function useDeferredViewReady(active, delay = 80) {
    const [readyState, setReadyState] = (0,react.useState)({
        active,
        ready: false
    });
    (0,react.useEffect)(()=>{
        if (false) {}
        let timeoutId;
        const frameId = window.requestAnimationFrame(()=>{
            if (!active) {
                setReadyState({
                    active,
                    ready: false
                });
                return;
            }
            timeoutId = window.setTimeout(()=>setReadyState({
                    active,
                    ready: true
                }), delay);
        });
        return ()=>{
            window.cancelAnimationFrame(frameId);
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        };
    }, [
        active,
        delay
    ]);
    return active && readyState.active === active && readyState.ready;
}
function hasCalculation(item) {
    return Boolean(item.calculation);
}
function categoryLabel(category) {
    return categories.find((item)=>item.value === category)?.label ?? category;
}
function consecutiveWrong(result) {
    if (!result?.details.length) return 0;
    let count = 0;
    for(let index = result.details.length - 1; index >= 0; index -= 1){
        if (result.details[index].success) break;
        count += 1;
    }
    return count;
}
function recentSuccessCount(result) {
    return result?.last10.filter(Boolean).length ?? 0;
}
function ruleSmartScore(rule, result) {
    if (!rule.enabled || !result || result.error || !result.total) return -10000;
    const wrong = consecutiveWrong(result);
    const recentRate = result.last10.length ? recentSuccessCount(result) / result.last10.length * 100 : result.successRate;
    return Number((result.successRate * 1.1 + recentRate * 0.8 + result.currentStreak * 2 + result.maxStreak * 0.4 - wrong * 8 - result.failed * 0.08).toFixed(3));
}
function sortRulesForManagement(rules, resultMap, sortKey) {
    return [
        ...rules
    ].sort((a, b)=>{
        const ar = resultMap.get(a.id);
        const br = resultMap.get(b.id);
        switch(sortKey){
            case "success_desc":
                return (br?.successRate ?? -1) - (ar?.successRate ?? -1) || a.name.localeCompare(b.name, "zh-CN");
            case "recent_desc":
                return recentSuccessCount(br) - recentSuccessCount(ar) || (br?.successRate ?? 0) - (ar?.successRate ?? 0);
            case "wrong_asc":
                return consecutiveWrong(ar) - consecutiveWrong(br) || (br?.successRate ?? 0) - (ar?.successRate ?? 0);
            case "failed_asc":
                return (ar?.failed ?? Number.MAX_SAFE_INTEGER) - (br?.failed ?? Number.MAX_SAFE_INTEGER) || (br?.successRate ?? 0) - (ar?.successRate ?? 0);
            case "streak_desc":
                return (br?.currentStreak ?? 0) - (ar?.currentStreak ?? 0) || (br?.successRate ?? 0) - (ar?.successRate ?? 0);
            case "name_asc":
                return a.name.localeCompare(b.name, "zh-CN", {
                    numeric: true
                });
            case "smart":
            default:
                return ruleSmartScore(b, br) - ruleSmartScore(a, ar) || (br?.successRate ?? 0) - (ar?.successRate ?? 0) || a.name.localeCompare(b.name, "zh-CN");
        }
    });
}
function buildRuleHealthRow(rule, result) {
    const wrongStreak = consecutiveWrong(result);
    const latestCheckedIssue = result?.details.at(-1)?.currentIssue;
    if (rule.participatesInReference === false) {
        return {
            rule,
            result,
            wrongStreak,
            latestCheckedIssue,
            status: "manual_reserve",
            reason: "已放入备选库：继续回测，但暂不参与综合参考。"
        };
    }
    if (result?.error || !result?.total) {
        return {
            rule,
            result,
            wrongStreak,
            latestCheckedIssue,
            status: "reserve",
            reason: "计算异常或缺少有效回测，建议先放入备选库并修正公式。"
        };
    }
    if (wrongStreak >= 10 && result.successRate < 80) {
        return {
            rule,
            result,
            wrongStreak,
            latestCheckedIssue,
            status: "reserve",
            reason: "连错较长且历史命中率不足 80%，建议放入备选库继续观察。"
        };
    }
    if (wrongStreak > 0) {
        return {
            rule,
            result,
            wrongStreak,
            latestCheckedIssue,
            status: "watch",
            reason: wrongStreak >= 10 ? "虽然连错达到 10 期，但历史命中率仍在 80% 以上，先保留并提醒观察。" : "最近出现错误，继续参与但提醒观察。"
        };
    }
    return {
        rule,
        result,
        wrongStreak,
        latestCheckedIssue,
        status: "keep",
        reason: "最近未连错，继续参与综合参考。"
    };
}
function RuleReconciliationPanel({ rows }) {
    const recognized = rows.reduce((sum, row)=>sum + row.recognizedCount, 0);
    const failed = rows.reduce((sum, row)=>sum + row.failedRecognitionCount, 0);
    const pending = rows.reduce((sum, row)=>sum + row.pendingConfirmationCount, 0);
    const participating = rows.reduce((sum, row)=>sum + row.participatingCount, 0);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "font-semibold text-white",
                                children: "规则完整性对账"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "按每个 TXT 文件核对：识别了多少条公式、哪些已入库、哪些未做样例核对、哪些参与综合参考结果。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "cyan",
                                children: [
                                    "已识别 ",
                                    recognized
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: failed ? "rose" : "green",
                                children: [
                                    "识别失败 ",
                                    failed
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: pending ? "yellow" : "green",
                                children: [
                                    "未核对 ",
                                    pending
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "green",
                                children: [
                                    "参与 ",
                                    participating
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 max-h-80 overflow-auto rounded-lg border border-white/[0.08] bg-black/15",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                    className: "w-full min-w-[920px] text-left text-xs",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                            className: "sticky top-0 bg-[#0b0f1a]/95 text-slate-500 backdrop-blur",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "TXT 文件"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "识别"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "入库"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "失败"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "未核对"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "不一致"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "参与综合参考"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                                        className: "px-3 py-3",
                                        children: "识别公式"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("tbody", {
                            children: rows.map((row)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                    className: "border-t border-white/[0.06] text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "max-w-[320px] px-3 py-3 text-slate-100",
                                            children: row.sourceFile
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-3 py-3",
                                            children: row.recognizedCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "px-3 py-3",
                                            children: row.enteredLibraryCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: cn("px-3 py-3", row.failedRecognitionCount ? "text-rose-200" : "text-slate-500"),
                                            children: row.failedRecognitionCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: cn("px-3 py-3", row.pendingConfirmationCount ? "text-amber-200" : "text-slate-500"),
                                            children: row.pendingConfirmationCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: cn("px-3 py-3", row.mismatchCount ? "text-rose-200" : "text-slate-500"),
                                            children: row.mismatchCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: cn("px-3 py-3", row.participatingCount ? "text-emerald-200" : "text-slate-500"),
                                            children: row.participatingCount
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                                            className: "max-w-[320px] px-3 py-3 text-slate-400",
                                            children: row.ruleNames.length ? row.ruleNames.slice(0, 3).join("、") : row.failedReason
                                        })
                                    ]
                                }, row.sourceFile))
                        })
                    ]
                })
            })
        ]
    });
}
function formatLocalDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("zh-CN", {
        hour12: false
    });
}
function FormulaExceptionPanel({ items, calculableCount }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "font-semibold text-white",
                                children: "异常公式集中显示"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "这里集中列出不能参与综合参考的公式原因，点击编辑后可直接修复。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: "green",
                                children: [
                                    "可计算公式：",
                                    calculableCount
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: items.length ? "rose" : "green",
                                children: [
                                    "不能参与：",
                                    items.length
                                ]
                            })
                        ]
                    })
                ]
            }),
            items.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/5 p-4 text-sm text-emerald-100",
                children: "当前没有需要集中处理的异常公式。"
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2",
                children: items.slice(0, 8).map(({ rule, summary })=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-4",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                className: "font-medium text-white",
                                                children: rule.name
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-1 text-xs text-slate-400",
                                                children: [
                                                    sourceTypeLabel(rule.sourceType),
                                                    " \xb7 ",
                                                    categoryLabel(rule.category),
                                                    " \xb7 ",
                                                    rule.orderMode,
                                                    "序"
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: summary.tone,
                                        children: summary.label
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-3 text-xs leading-5 text-rose-100",
                                children: summary.reason
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-3 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                        href: `/formula-editor?ruleId=${encodeURIComponent(rule.id)}`,
                                        className: "inline-flex h-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs text-slate-100 hover:bg-white/[0.09]",
                                        children: "编辑修复"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                        size: "sm",
                                        onClick: ()=>void useRuleQuantStore.getState().toggleReferenceParticipation(rule.id),
                                        children: rule.participatesInReference === false ? "加入参考" : "退出参考"
                                    })
                                ]
                            })
                        ]
                    }, rule.id))
            })
        ]
    });
}
function FormulaLibraryBackupPanel({ rules, backups, status, onImport, onReset, onRestore }) {
    const latestBackup = backups[0];
    const [resetArmed, setResetArmed] = (0,react.useState)(false);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "font-semibold text-white",
                                children: "公式库备份"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "公式会同时保存到浏览器数据库和大容量备用存储，不限制固定条数；JSON 可用于跨设备恢复。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "shrink-0",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                            tone: latestBackup ? "green" : "yellow",
                            children: latestBackup ? `最近备份 ${formatLocalDateTime(latestBackup.createdAt)}` : "暂无备份"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        onClick: ()=>exportJson({
                                exportedAt: new Date().toISOString(),
                                rules
                            }, "rulequant-rules-backup.json"),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "导出公式库 JSON"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                        className: "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 text-sm text-slate-100 hover:bg-white/[0.09]",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(upload/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "导入 JSON / TXT",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                className: "hidden",
                                type: "file",
                                accept: ".json,.txt,application/json,text/plain",
                                onChange: (event)=>{
                                    onImport(event.target.files?.[0]);
                                    event.currentTarget.value = "";
                                }
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        onClick: onRestore,
                        disabled: !latestBackup,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "恢复上一次公式库"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        variant: "danger",
                        onClick: ()=>{
                            if (!resetArmed) {
                                setResetArmed(true);
                                return;
                            }
                            setResetArmed(false);
                            onReset();
                        },
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            resetArmed ? "再次点击确认重置" : "重置为内置公式"
                        ]
                    })
                ]
            }),
            resetArmed && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-3 rounded-md border border-rose-300/25 bg-rose-300/[0.08] p-3 text-sm text-rose-100",
                children: "此操作会移除人工新增规则。请再次点击红色按钮确认；不操作则不会重置。"
            }),
            status && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: cn("mt-4 rounded-lg border p-3 text-sm", status.includes("失败") ? "border-rose-300/25 bg-rose-300/10 text-rose-100" : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"),
                children: [
                    status,
                    !status.includes("失败") && /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                        href: "/rules",
                        className: "ml-3 text-cyan-100 underline-offset-4 hover:underline",
                        children: "在公式管理查看"
                    })
                ]
            }),
            latestBackup && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "mt-3 text-xs text-slate-500",
                children: [
                    "最近备份原因：",
                    latestBackup.reason
                ]
            })
        ]
    });
}
function OperationLogPanel({ logs }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                className: "font-semibold text-white",
                                children: "运行记录 / 操作日志"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "记录同步、计算、公式变更、备份恢复等关键动作，方便后续排错。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        tone: "cyan",
                        children: [
                            logs.length,
                            " 条"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 space-y-2",
                children: [
                    logs.length === 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-500",
                        children: "暂无运行记录。"
                    }),
                    logs.slice(0, 8).map((log)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex items-center justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                            className: "text-slate-100",
                                            children: log.message
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "shrink-0 text-xs text-slate-500",
                                            children: formatLocalDateTime(log.timestamp)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                    className: "mt-1 text-xs text-slate-500",
                                    children: [
                                        log.issue ? `期号 ${log.issue} · ` : "",
                                        typeof log.dataCount === "number" ? `数据 ${log.dataCount} 条 · ` : "",
                                        typeof log.formulaCount === "number" ? `公式 ${log.formulaCount} 条 · ` : "",
                                        typeof log.signalCount === "number" ? `依据 ${log.signalCount} 条` : ""
                                    ]
                                })
                            ]
                        }, log.id))
                ]
            })
        ]
    });
}
function rulequant_terminal_Metric({ label, value, hint, tone = "cyan" }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-w-0 rounded-md border border-white/[0.065] bg-black/15 p-3",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex min-w-0 items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "truncate text-[12px] leading-5 text-slate-500",
                        children: label
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: tone,
                        children: hint ?? "实时"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-2 min-w-0 break-words font-mono text-[20px] font-semibold leading-tight text-white sm:text-[24px]",
                children: value
            })
        ]
    });
}
function ComputationPendingPanel({ title, desc }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
        className: "p-5",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(activity/* default */.A, {
                    className: "h-5 w-5 animate-pulse text-cyan-200"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                            className: "font-semibold text-white",
                            children: title
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "mt-1 text-sm text-slate-500",
                            children: desc
                        })
                    ]
                })
            ]
        })
    });
}
function NumberTile({ number, special = false, config }) {
    const label = rulequant_terminal_numberWithZodiac(number, config).split(" ");
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
        className: cn("flex h-11 w-11 flex-col items-center justify-center rounded-md border text-center sm:h-12 sm:w-12", special ? "border-cyan-300/35 bg-cyan-300/12 text-cyan-50" : "border-white/[0.075] bg-white/[0.04] text-white"),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "font-mono text-[15px] leading-none",
                children: rulequant_terminal_padNumber(number)
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "mt-1 text-[11px] leading-none text-slate-300",
                children: label[1] ?? ""
            })
        ]
    });
}
function LatestDrawCard({ draw, config, issue, source }) {
    const numbers = draw ? [
        draw.n1,
        draw.n2,
        draw.n3,
        draw.n4,
        draw.n5,
        draw.n6
    ] : [];
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-w-0 rounded-md border border-cyan-300/15 bg-cyan-300/[0.045] p-3 sm:col-span-2 xl:col-span-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-wrap items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-[12px] leading-5 text-slate-500",
                        children: "最新开奖号码"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: "cyan",
                        children: issue ?? draw?.issue ?? "-"
                    })
                ]
            }),
            draw ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-3 grid grid-cols-4 gap-2 sm:flex sm:min-w-0 sm:flex-wrap sm:items-center",
                children: [
                    numbers.map((number, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(NumberTile, {
                            number: number,
                            config: config
                        }, `${draw.issue}-${index}-${number}`)),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                        className: "flex h-11 items-center justify-center px-1 font-mono text-lg text-cyan-100 sm:h-12",
                        children: "+"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(NumberTile, {
                        number: draw.special,
                        special: true,
                        config: config
                    })
                ]
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-3 text-sm text-slate-500",
                children: "暂无开奖数据"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-3 text-xs text-slate-500",
                children: source || "平1-6 + 特码，号码下方标注生肖"
            })
        ]
    });
}
function codeValue(value) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
        className: "font-mono text-xs text-cyan-100",
        children: String(value)
    });
}
function rulequant_terminal_padNumber(value) {
    return String(value).padStart(2, "0");
}
function isValidDrawNumber(value) {
    return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 49;
}
function normalizeManualDrawNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 1;
    return Math.min(49, Math.max(1, Math.round(number)));
}
function rulequant_terminal_numberWithZodiac(value, config) {
    try {
        const attributes = (0,engine_attributes/* getNumberAttributes */.hJ)(value, config);
        return `${rulequant_terminal_padNumber(value)} ${attributes.zodiac}`;
    } catch  {
        return rulequant_terminal_padNumber(value);
    }
}
function drawNumbersWithZodiac(draw, config) {
    if (!draw) return "-";
    return [
        draw.n1,
        draw.n2,
        draw.n3,
        draw.n4,
        draw.n5,
        draw.n6,
        draw.special
    ].map((number)=>isValidDrawNumber(number) ? rulequant_terminal_numberWithZodiac(number, config) : `${String(number || "-")} 待修正`).join("  ");
}
function candidateNumberLabel(item) {
    return `${rulequant_terminal_padNumber(item.number)} ${item.zodiac}`;
}
function rulequant_terminal_sortDrawRecords(records) {
    return [
        ...records
    ].sort((a, b)=>{
        const aNumber = /^\d+$/.test(a.issue) ? Number(a.issue) : undefined;
        const bNumber = /^\d+$/.test(b.issue) ? Number(b.issue) : undefined;
        if (aNumber !== undefined && bNumber !== undefined) return aNumber - bNumber;
        if (aNumber !== undefined) return 1;
        if (bNumber !== undefined) return -1;
        return a.issue.localeCompare(b.issue, "zh-CN", {
            numeric: true
        });
    });
}
function isManualDrawRecord(record) {
    return record.sourceUrl === "manual://user-input" || record.rawAttributes?.sourceType === "manual";
}
function mergeDrawRecords(primary, extra) {
    const merged = new Map(primary.map((record)=>[
            record.issue,
            record
        ]));
    extra.forEach((record)=>merged.set(record.issue, record));
    return rulequant_terminal_sortDrawRecords([
        ...merged.values()
    ]);
}
function parsePositionPattern(value) {
    const text = String(value || "").replace(/[平落取循环]/g, "").trim();
    if (/1234567\.1234567/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        1,
        2,
        3,
        4,
        5,
        6,
        7
    ];
    if (/7654321\.7654321/.test(text)) return [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ];
    if (/7654321\.23456/.test(text)) return [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        2,
        3,
        4,
        5,
        6
    ];
    if (/123456\.5432\.123456\.5432/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2,
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2
    ];
    if (/123456\.5432/.test(text)) return [
        1,
        2,
        3,
        4,
        5,
        6,
        5,
        4,
        3,
        2
    ];
    return text.split(/[,，.\s]+/).filter(Boolean).flatMap((part)=>/^[1-7]+$/.test(part) ? [
            ...part
        ].map(Number) : [
            Number(part)
        ]).filter((item)=>Number.isFinite(item) && item >= 1 && item <= 7);
/*
  return String(value || "")
    .split(/[,，\s]+/)
    .filter(Boolean)
    .map(Number);
  */ }
function buildRuleFromFormData(formData, options = {}) {
    const now = new Date().toISOString();
    const rawId = String(formData.get("id") || "");
    const id = options.forceNew || !rawId ? `rule-${Date.now()}` : rawId;
    const existingRule = options.forceNew ? undefined : options.existingRule;
    return {
        id,
        name: String(formData.get("name") || "未命名规则"),
        category: String(formData.get("category") || "kill_zodiac"),
        orderMode: String(formData.get("orderMode") || "L"),
        formula: String(formData.get("formula") || "平1 + 特码尾"),
        normalizer: String(formData.get("normalizer") || "auto"),
        target: String(formData.get("target") || "special"),
        verifyMode: "next_special",
        positionPattern: parsePositionPattern(formData.get("positionPattern")),
        anchorIssue: String(formData.get("anchorIssue") || "") || undefined,
        anchorPatternIndex: formData.get("anchorPatternIndex") === null || String(formData.get("anchorPatternIndex") || "") === "" ? undefined : Number(formData.get("anchorPatternIndex")),
        positionMeaning: String(formData.get("positionMeaning") || "") || undefined,
        periodSpan: Number(formData.get("periodSpan") || 1),
        verifyOffset: Number(formData.get("verifyOffset") || formData.get("periodSpan") || 1),
        enabled: formData.get("enabled") === "on",
        manuallyConfirmed: formData.get("manuallyConfirmed") === "on",
        participatesInReference: formData.get("participatesInReference") === "on",
        sourceType: String(formData.get("sourceType") || existingRule?.sourceType || "manual"),
        tags: String(formData.get("tags") || "").split(/[,，\s]+/).filter(Boolean),
        description: String(formData.get("description") || ""),
        sourceFile: String(formData.get("sourceFile") || "手动录入"),
        examples: existingRule?.examples ?? [],
        createdAt: existingRule?.createdAt ?? now,
        updatedAt: now
    };
}
function RuleQuantTerminal({ activeView }) {
    const [mounted, setMounted] = (0,react.useState)(false);
    (0,react.useEffect)(()=>{
        const timeoutId = window.setTimeout(()=>setMounted(true), 0);
        return ()=>window.clearTimeout(timeoutId);
    }, []);
    if (!mounted) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)("main", {
            className: "min-h-screen bg-[#070b12] p-6 text-slate-100",
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "mx-auto max-w-6xl p-6",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: "cyan",
                        children: "RuleQuant"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                        className: "mt-3 text-[28px] font-semibold leading-tight text-white",
                        children: viewLabels[activeView]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-2 text-sm text-slate-500",
                        children: "正在加载本地公式库和开奖数据..."
                    })
                ]
            })
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(RuleQuantTerminalClient, {
        activeView: activeView
    });
}
function RuleQuantTerminalClient({ activeView }) {
    const searchParams = (0,navigation.useSearchParams)();
    const store = useRuleQuantStore();
    const { draws, rules, samples, operationLogs, ruleBackups, referenceHistory, config, selectedRuleId, cloudStateMeta, cloudPublishStatus, cloudPublishMessage, lastCloudPublishAt, hasHydrated } = store;
    const hydrate = store.hydrate;
    const [importText, setImportText] = (0,react.useState)("issue,n1,n2,n3,n4,n5,n6,special\n2026166,8,13,19,27,35,44,6");
    const [importErrors, setImportErrors] = (0,react.useState)([]);
    const [previewDraws, setPreviewDraws] = (0,react.useState)([]);
    const [sourceUrl, setSourceUrl] = (0,react.useState)("https://thjffv.ag0rkv-4pnok-ljvvrg.xyz:16633/kj/3/2026.html");
    const [sourceFromYear, setSourceFromYear] = (0,react.useState)(String(new Date().getFullYear()));
    const [sourceToYear, setSourceToYear] = (0,react.useState)(String(new Date().getFullYear()));
    const [sourceRecords, setSourceRecords] = (0,react.useState)([]);
    const [sourceSummaries, setSourceSummaries] = (0,react.useState)([]);
    const [sourceStatus, setSourceStatus] = (0,react.useState)("");
    const [sourceLoading, setSourceLoading] = (0,react.useState)(false);
    const sourceAutoFetchedAt = (0,react.useRef)(0);
    const referenceAutoSavedSignature = (0,react.useRef)("");
    const [candidateTab, setCandidateTab] = (0,react.useState)("numbers8");
    const [candidateFocus, setCandidateFocus] = (0,react.useState)(null);
    const [referenceGeneratedAt, setReferenceGeneratedAt] = (0,react.useState)("");
    const [referenceRunId, setReferenceRunId] = (0,react.useState)(0);
    const [referenceCalculating, setReferenceCalculating] = (0,react.useState)(false);
    const [referenceStatus, setReferenceStatus] = (0,react.useState)("");
    const [oneClickCalculating, setOneClickCalculating] = (0,react.useState)(false);
    const [oneClickStatus, setOneClickStatus] = (0,react.useState)("");
    const [discoveryFocusId, setDiscoveryFocusId] = (0,react.useState)("");
    const [discoveryStatus, setDiscoveryStatus] = (0,react.useState)("");
    const [discoveryDepth, setDiscoveryDepth] = (0,react.useState)("balanced");
    const [discoveryResult, setDiscoveryResult] = (0,react.useState)({
        key: "",
        candidates: []
    });
    const [ruleLibraryStatus, setRuleLibraryStatus] = (0,react.useState)("");
    const [lastCalculationAt, setLastCalculationAt] = (0,react.useState)(()=> false ? 0 : localStorage.getItem("rulequant:lastCalculationAt") ?? "");
    const [lastSyncAt, setLastSyncAt] = (0,react.useState)(()=> false ? 0 : localStorage.getItem("rulequant:lastSyncAt") ?? "");
    const [ledgerVisibleState, setLedgerVisibleState] = (0,react.useState)({
        ruleId: "",
        count: 20
    });
    const [oneClickMode, setOneClickMode] = (0,react.useState)("latest");
    const [manualDraw, setManualDraw] = (0,react.useState)(()=>({
            issue: `manual-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "")}`,
            n1: 1,
            n2: 2,
            n3: 3,
            n4: 4,
            n5: 5,
            n6: 6,
            special: 7
        }));
    const [ruleFilter, setRuleFilter] = (0,react.useState)("all");
    const [ruleLibraryFilter, setRuleLibraryFilter] = (0,react.useState)("all");
    const [ruleSort, setRuleSort] = (0,react.useState)("smart");
    const [selectedComboRuleIds, setSelectedComboRuleIds] = (0,react.useState)([]);
    const [referenceArchiveIssue, setReferenceArchiveIssue] = (0,react.useState)("");
    const [referenceArchiveSaving, setReferenceArchiveSaving] = (0,react.useState)(false);
    const [sampleDraft, setSampleDraft] = (0,react.useState)({
        ruleId: selectedRuleId,
        issue: draws[0]?.issue ?? "",
        expectedRawResult: "",
        expectedFinalResult: "",
        expectedMappedResult: "",
        expectedSuccess: "true"
    });
    (0,react.useEffect)(()=>{
        void hydrate();
    }, [
        hydrate
    ]);
    const selectedRule = rules.find((rule)=>rule.id === selectedRuleId) ?? rules[0];
    const editorMode = searchParams.get("mode");
    const editorRuleId = searchParams.get("ruleId");
    const editorRule = activeView === "formula-editor" && editorMode === "new" ? undefined : activeView === "formula-editor" && editorRuleId ? rules.find((rule)=>rule.id === editorRuleId) : selectedRule;
    const ledgerVisibleCount = ledgerVisibleState.ruleId === selectedRuleId ? ledgerVisibleState.count : 20;
    const websiteDraws = (0,react.useMemo)(()=>rulequant_terminal_sortDrawRecords(sourceRecords), [
        sourceRecords
    ]);
    const manualLocalDraws = (0,react.useMemo)(()=>rulequant_terminal_sortDrawRecords(draws.filter(isManualDrawRecord)), [
        draws
    ]);
    const activeDraws = (0,react.useMemo)(()=>websiteDraws.length ? mergeDrawRecords(websiteDraws, manualLocalDraws) : rulequant_terminal_sortDrawRecords(draws), [
        draws,
        manualLocalDraws,
        websiteDraws
    ]);
    const normalizedDraws = (0,react.useMemo)(()=>activeDraws.map((draw)=>(0,engine_attributes/* normalizeDraw */.YC)(draw, config)), [
        activeDraws,
        config
    ]);
    const latestDraw = normalizedDraws.at(-1);
    const latestRawDraw = activeDraws.at(-1);
    const latestPeriodIndex = Math.max(normalizedDraws.length - 1, 0);
    const selectedReferenceArchiveIssue = referenceArchiveIssue || latestRawDraw?.issue || "";
    const hasManualDraws = manualLocalDraws.length > 0;
    const hasLiveDraws = activeDraws.some((draw)=>Boolean(draw.sourceUrl) && !isManualDrawRecord(draw));
    const isSeedOnly = !hasLiveDraws && draws.length === seedDraws.length && draws.every((draw, index)=>draw.issue === seedDraws[index]?.issue);
    const isCloudData = Boolean(cloudStateMeta?.enabled && cloudStateMeta.recordCount);
    const hasSharedDraws = hasLiveDraws || isCloudData || websiteDraws.length > 0 || hasManualDraws;
    const isStaticShareHost =  true && window.location.hostname.endsWith("github.io");
    const hasCloudAdminToken =  true && Boolean(window.localStorage.getItem("rulequant:adminToken") || rulequant_terminal_process.env.NEXT_PUBLIC_RULEQUANT_ADMIN_TOKEN);
    const showCloudPublishControls = hasCloudAdminToken || !isStaticShareHost;
    const cloudSyncAt = cloudStateMeta?.updatedAt ? new Date(cloudStateMeta.updatedAt).toLocaleString("zh-CN", {
        hour12: false
    }) : "";
    const staticSnapshotAt = isStaticShareHost && hasSharedDraws ? cloudSyncAt || latestRawDraw?.date || "静态快照" : "";
    const displayLastSyncAt = lastSyncAt || cloudSyncAt || staticSnapshotAt;
    const isUsingSyncedData = websiteDraws.length > 0 || isCloudData || hasLiveDraws;
    const dataSourceLabel = sourceLoading ? "同步中" : websiteDraws.length && hasManualDraws ? "网站全年数据 + 人工录入" : websiteDraws.length ? "网站全年数据" : isCloudData && hasManualDraws ? "云端数据库 + 人工录入" : isCloudData ? "云端数据库" : hasLiveDraws ? "实时网址" : hasManualDraws ? "本地库 + 人工录入" : isSeedOnly ? "示例数据" : "本地库";
    const sourceRecordBadgeTone = sourceRecords.length || isStaticShareHost && hasSharedDraws ? "green" : "slate";
    const sourceRecordBadgeLabel = sourceRecords.length ? `${sourceRecords.length} 条网址记录${hasManualDraws ? ` + ${manualLocalDraws.length} 条人工` : ""}` : isStaticShareHost && hasSharedDraws ? `${activeDraws.length} 条静态记录` : "未同步";
    const shouldWarnStaleData = !websiteDraws.length && !(isStaticShareHost && hasSharedDraws);
    const latestNumbersLabel = drawNumbersWithZodiac(latestRawDraw, config);
    const isCandidatePoolReady = useDeferredViewReady(activeView === "candidate-pool");
    const isFormulaDiscoveryReady = useDeferredViewReady(activeView === "formula-discovery");
    const isFormulaDiscoveryPreparing = activeView === "formula-discovery" && !isFormulaDiscoveryReady;
    const isCandidatePoolPreparing = activeView === "candidate-pool" && !isCandidatePoolReady;
    const shouldBuildBacktest = activeView === "dashboard" || activeView === "rules" || activeView === "formula-detail" || activeView === "sample-check" || activeView === "candidate-pool" && isCandidatePoolReady || activeView === "backtest" || activeView === "reports";
    const backtest = (0,react.useMemo)(()=>{
        if (!shouldBuildBacktest) return EMPTY_BACKTEST;
        return (0,run_backtest/* runBacktest */.rt)({
            draws: activeDraws,
            rules,
            config
        });
    }, [
        shouldBuildBacktest,
        activeDraws,
        rules,
        config
    ]);
    const selectedRuleResult = (0,react.useMemo)(()=>backtest.ruleResults.find((item)=>item.rule.id === selectedRule?.id) ?? backtest.ruleResults[0], [
        backtest,
        selectedRule?.id
    ]);
    const shouldBuildValidation = activeView === "dashboard" || activeView === "rules" || activeView === "formula-detail" || activeView === "sample-check" || activeView === "candidate-pool" && isCandidatePoolReady;
    const validationSampleResults = (0,react.useMemo)(()=>{
        if (!shouldBuildValidation) return [];
        return runSampleChecks({
            cases: samples,
            draws: activeDraws,
            rules,
            config
        });
    }, [
        shouldBuildValidation,
        samples,
        activeDraws,
        rules,
        config
    ]);
    const ruleValidationSummaries = (0,react.useMemo)(()=>shouldBuildValidation ? buildRuleValidationSummaries({
            rules,
            backtest,
            sampleResults: validationSampleResults
        }) : [], [
        shouldBuildValidation,
        rules,
        backtest,
        validationSampleResults
    ]);
    const ruleReconciliationRows = (0,react.useMemo)(()=>activeView === "rules" ? buildRuleReconciliation({
            sourceFiles: rawRuleFiles,
            rules,
            validationSummaries: ruleValidationSummaries
        }) : [], [
        activeView,
        rules,
        ruleValidationSummaries
    ]);
    const ruleValidationById = (0,react.useMemo)(()=>new Map(ruleValidationSummaries.map((summary)=>[
                summary.ruleId,
                summary
            ])), [
        ruleValidationSummaries
    ]);
    const enabledRuleCount = (0,react.useMemo)(()=>rules.filter((rule)=>rule.enabled).length, [
        rules
    ]);
    const passedRuleCount = (0,react.useMemo)(()=>ruleValidationSummaries.filter((summary)=>summary.status === "checked").length, [
        ruleValidationSummaries
    ]);
    const checkedSampleRuleCount = (0,react.useMemo)(()=>ruleValidationSummaries.filter((summary)=>summary.sampleCount > 0).length, [
        ruleValidationSummaries
    ]);
    const uncheckedSampleRuleCount = (0,react.useMemo)(()=>ruleValidationSummaries.filter((summary)=>summary.status === "unchecked").length, [
        ruleValidationSummaries
    ]);
    const calculableRuleCount = (0,react.useMemo)(()=>{
        if (!shouldBuildBacktest) {
            return rules.filter((rule)=>canRuleParticipateInReference(rule)).length;
        }
        return backtest.ruleResults.filter((result)=>result.rule.enabled && !result.error && result.total > 0).length;
    }, [
        backtest.ruleResults,
        rules,
        shouldBuildBacktest
    ]);
    const referenceRuleCount = (0,react.useMemo)(()=>rules.filter((rule)=>canRuleParticipateInReference(rule, ruleValidationById.get(rule.id))).length, [
        rules,
        ruleValidationById
    ]);
    const pendingRuleCount = (0,react.useMemo)(()=>ruleValidationSummaries.filter((summary)=>summary.status === "unchecked").length, [
        ruleValidationSummaries
    ]);
    const excludedRuleCount = Math.max(enabledRuleCount - referenceRuleCount, 0);
    const userProvidedRuleCount = (0,react.useMemo)(()=>rules.filter((rule)=>(rule.sourceType ?? "user_provided") === "user_provided").length, [
        rules
    ]);
    const manualRuleCount = (0,react.useMemo)(()=>rules.filter((rule)=>rule.sourceType === "manual").length, [
        rules
    ]);
    const systemRecommendedRuleCount = (0,react.useMemo)(()=>rules.filter((rule)=>rule.sourceType === "system_recommended").length, [
        rules
    ]);
    const exceptionRules = (0,react.useMemo)(()=>ruleValidationSummaries.map((summary)=>({
                summary,
                rule: rules.find((rule)=>rule.id === summary.ruleId)
            })).filter((item)=>Boolean(item.rule)).filter(({ rule, summary })=>rule.enabled && !canRuleParticipateInReference(rule, summary)), [
        ruleValidationSummaries,
        rules
    ]);
    const ruleHealthRows = (0,react.useMemo)(()=>{
        if (activeView === "dashboard") return [];
        const resultMap = new Map(backtest.ruleResults.map((result)=>[
                result.rule.id,
                result
            ]));
        return rules.filter((rule)=>rule.enabled).map((rule)=>buildRuleHealthRow(rule, resultMap.get(rule.id))).sort((a, b)=>{
            const order = {
                reserve: 0,
                manual_reserve: 1,
                watch: 2,
                keep: 3
            };
            return order[a.status] - order[b.status] || b.wrongStreak - a.wrongStreak || (b.result?.successRate ?? 0) - (a.result?.successRate ?? 0);
        });
    }, [
        activeView,
        backtest.ruleResults,
        rules
    ]);
    const ruleResultMap = (0,react.useMemo)(()=>new Map(backtest.ruleResults.map((result)=>[
                result.rule.id,
                result
            ])), [
        backtest.ruleResults
    ]);
    const visibleRules = (0,react.useMemo)(()=>{
        const filtered = rules.filter((rule)=>{
            if (ruleFilter !== "all" && rule.category !== ruleFilter) return false;
            const result = ruleResultMap.get(rule.id);
            switch(ruleLibraryFilter){
                case "user_provided":
                case "system_recommended":
                case "manual":
                case "txt_import":
                case "copied":
                    return (rule.sourceType ?? "user_provided") === ruleLibraryFilter;
                case "enabled":
                    return rule.enabled;
                case "disabled":
                    return !rule.enabled;
                case "calculable":
                    return Boolean(result && !result.error && result.total > 0);
                case "error":
                    return Boolean(result?.error || rule.enabled && result && result.total === 0);
                case "all":
                default:
                    return true;
            }
        });
        const sorted = sortRulesForManagement(filtered, ruleResultMap, ruleSort);
        const selectedIndex = sorted.findIndex((rule)=>rule.id === selectedRuleId);
        if (selectedIndex <= 0) return sorted;
        return [
            sorted[selectedIndex],
            ...sorted.slice(0, selectedIndex),
            ...sorted.slice(selectedIndex + 1)
        ];
    }, [
        rules,
        ruleFilter,
        ruleLibraryFilter,
        ruleResultMap,
        ruleSort,
        selectedRuleId
    ]);
    const sampleResults = (0,react.useMemo)(()=>{
        if (activeView !== "sample-check" && activeView !== "reports") return [];
        return validationSampleResults.length ? validationSampleResults : runSampleChecks({
            cases: samples,
            draws: activeDraws,
            rules,
            config
        });
    }, [
        activeView,
        validationSampleResults,
        samples,
        activeDraws,
        rules,
        config
    ]);
    const nextOutputs = (0,react.useMemo)(()=>{
        if (activeView !== "next-output") return [];
        if (!latestDraw) return [];
        return rules.filter((rule)=>rule.enabled).map((rule)=>{
            try {
                return {
                    rule,
                    calculation: runRuleCalculation(rule, latestDraw, config, {
                        periodIndex: latestPeriodIndex
                    })
                };
            } catch (error) {
                return {
                    rule,
                    error: error instanceof Error ? error.message : String(error)
                };
            }
        });
    }, [
        activeView,
        rules,
        latestDraw,
        latestPeriodIndex,
        config
    ]);
    const researchDraws = activeDraws;
    const shouldBuildCandidateReport = activeView === "dashboard" || activeView === "candidate-pool" && isCandidatePoolReady || activeView === "reports";
    const candidateBacktest = backtest;
    const candidateReport = (0,react.useMemo)(()=>{
        if (!shouldBuildCandidateReport) return EMPTY_CANDIDATE_REPORT;
        void referenceRunId;
        return generateCandidatePool({
            draws: researchDraws,
            rules,
            config,
            backtest: candidateBacktest,
            validationSummaries: ruleValidationSummaries
        });
    }, [
        shouldBuildCandidateReport,
        researchDraws,
        rules,
        config,
        candidateBacktest,
        ruleValidationSummaries,
        referenceRunId
    ]);
    (0,react.useEffect)(()=>{
        if (activeView !== "candidate-pool") return;
        if (!candidateReport.signalCount || !candidateReport.ruleCount) return;
        const signature = referenceHistorySignature(candidateReport);
        if (referenceAutoSavedSignature.current === signature) return;
        referenceAutoSavedSignature.current = signature;
        if (referenceHistory.some((record)=>record.signature === signature)) return;
        void store.saveReferenceHistory(buildReferenceHistoryItem({
            report: candidateReport,
            saveType: "auto",
            dataSourceLabel,
            recordCount: activeDraws.length,
            note: "打开综合参考页自动保存"
        }));
    }, [
        activeDraws.length,
        activeView,
        candidateReport,
        dataSourceLabel,
        referenceHistory,
        store
    ]);
    const referenceObservation = (0,react.useMemo)(()=>{
        if (activeView !== "candidate-pool" || !isCandidatePoolReady) return EMPTY_REFERENCE_OBSERVATION;
        void referenceRunId;
        return buildReferenceObservation({
            draws: researchDraws,
            rules,
            config,
            validationSummaries: ruleValidationSummaries,
            window: 10
        });
    }, [
        activeView,
        isCandidatePoolReady,
        researchDraws,
        rules,
        config,
        ruleValidationSummaries,
        referenceRunId
    ]);
    const resolvedReferenceHistory = (0,react.useMemo)(()=>{
        if (activeView !== "candidate-pool" && activeView !== "reports") return [];
        return resolveReferenceHistoryOutcomes(referenceHistory, activeDraws, config);
    }, [
        activeDraws,
        activeView,
        config,
        referenceHistory
    ]);
    const manualComboRules = (0,react.useMemo)(()=>{
        const selected = rules.filter((rule)=>selectedComboRuleIds.includes(rule.id));
        return selected.length ? selected : rules.filter((rule)=>canRuleParticipateInReference(rule, ruleValidationById.get(rule.id))).slice(0, 6);
    }, [
        rules,
        ruleValidationById,
        selectedComboRuleIds
    ]);
    const manualComboReport = (0,react.useMemo)(()=>{
        if (activeView !== "candidate-pool" || !isCandidatePoolReady) return EMPTY_CANDIDATE_REPORT;
        return generateCandidatePool({
            draws: researchDraws,
            rules: manualComboRules,
            config,
            backtest: candidateBacktest,
            validationSummaries: ruleValidationSummaries
        });
    }, [
        activeView,
        isCandidatePoolReady,
        researchDraws,
        manualComboRules,
        config,
        candidateBacktest,
        ruleValidationSummaries
    ]);
    const manualDrawValidation = (0,react.useMemo)(()=>{
        const values = MANUAL_DRAW_KEYS.map((key)=>({
                key,
                value: Number(manualDraw[key])
            }));
        const invalidKeys = new Set();
        const errors = [];
        values.forEach(({ key, value })=>{
            if (!Number.isInteger(value) || value < 1 || value > 49) {
                invalidKeys.add(key);
            }
        });
        if (invalidKeys.size) errors.push("号码必须是 1-49 的整数");
        const seen = new Map();
        values.forEach(({ key, value })=>{
            if (!Number.isInteger(value) || value < 1 || value > 49) return;
            seen.set(value, [
                ...seen.get(value) ?? [],
                key
            ]);
        });
        const duplicatedValues = [
            ...seen.entries()
        ].filter(([, keys])=>keys.length > 1).map(([value])=>value);
        if (duplicatedValues.length) errors.push(`重复号码：${duplicatedValues.map((value)=>rulequant_terminal_padNumber(value)).join("、")}`);
        return {
            errors,
            invalidKeys,
            duplicatedValues,
            valid: errors.length === 0
        };
    }, [
        manualDraw
    ]);
    const selectedOneClickDraw = oneClickMode === "manual" ? manualDraw : latestRawDraw ?? manualDraw;
    const selectedOneClickPeriodIndex = (0,react.useMemo)(()=>{
        const index = activeDraws.findIndex((draw)=>draw.issue === selectedOneClickDraw.issue);
        return index >= 0 ? index : latestPeriodIndex;
    }, [
        activeDraws,
        latestPeriodIndex,
        selectedOneClickDraw.issue
    ]);
    const oneClickResults = (0,react.useMemo)(()=>{
        if (activeView !== "one-click") return [];
        if (oneClickMode === "manual" && !manualDrawValidation.valid) return [];
        return buildOneClickFormulaResults({
            draw: selectedOneClickDraw,
            rules,
            config,
            periodIndex: selectedOneClickPeriodIndex
        });
    }, [
        activeView,
        config,
        manualDrawValidation.valid,
        oneClickMode,
        rules,
        selectedOneClickDraw,
        selectedOneClickPeriodIndex
    ]);
    const selectedRuleLedger = (0,react.useMemo)(()=>{
        if (activeView !== "formula-detail" || !selectedRuleResult) return undefined;
        return buildFormulaLedger(selectedRuleResult, {
            draws: activeDraws,
            config
        });
    }, [
        activeView,
        selectedRuleResult,
        activeDraws,
        config
    ]);
    const selectedRuleValidation = selectedRule ? ruleValidationById.get(selectedRule.id) : undefined;
    const discoveryRequestKey = (0,react.useMemo)(()=>`${discoveryDepth}|${activeDraws.length}|${activeDraws.at(-1)?.issue ?? ""}|${JSON.stringify(config)}`, [
        activeDraws,
        config,
        discoveryDepth
    ]);
    const discoveryCandidates = (0,react.useMemo)(()=>discoveryResult.key === discoveryRequestKey ? discoveryResult.candidates : [], [
        discoveryRequestKey,
        discoveryResult
    ]);
    const discoveryLoading = activeView === "formula-discovery" && isFormulaDiscoveryReady && discoveryResult.key !== discoveryRequestKey;
    (0,react.useEffect)(()=>{
        if (activeView !== "formula-discovery" || !isFormulaDiscoveryReady) return;
        let cancelled = false;
        const worker = new Worker(__webpack_require__.tu(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u(802), __webpack_require__.b)));
        worker.onmessage = (event)=>{
            if (cancelled) return;
            if (event.data.ok) setDiscoveryResult({
                key: discoveryRequestKey,
                candidates: event.data.candidates ?? []
            });
            else setDiscoveryStatus(`筛选失败：${event.data.error ?? "后台计算异常"}`);
            worker.terminate();
        };
        worker.onerror = (event)=>{
            if (cancelled) return;
            setDiscoveryStatus(`筛选失败：${event.message || "后台线程无法启动"}`);
            setDiscoveryResult({
                key: discoveryRequestKey,
                candidates: []
            });
            worker.terminate();
        };
        worker.postMessage({
            draws: activeDraws,
            config,
            depth: discoveryDepth
        });
        return ()=>{
            cancelled = true;
            worker.terminate();
        };
    }, [
        activeView,
        isFormulaDiscoveryReady,
        activeDraws,
        config,
        discoveryDepth,
        discoveryRequestKey
    ]);
    const focusedDiscoveryCandidate = (0,react.useMemo)(()=>{
        if (activeView !== "formula-discovery") return undefined;
        return discoveryCandidates.find((candidate)=>candidate.rule.id === discoveryFocusId) ?? discoveryCandidates[0];
    }, [
        activeView,
        discoveryCandidates,
        discoveryFocusId
    ]);
    const focusedDiscoveryExistingRule = (0,react.useMemo)(()=>{
        if (!focusedDiscoveryCandidate) return undefined;
        const signature = buildRuleSignature(focusedDiscoveryCandidate.rule);
        return rules.find((rule)=>buildRuleSignature(rule) === signature);
    }, [
        focusedDiscoveryCandidate,
        rules
    ]);
    const focusedCandidate = (0,react.useMemo)(()=>{
        if (activeView !== "candidate-pool") return undefined;
        if (candidateFocus?.type === "number") return candidateReport.allNumbers.find((item)=>item.number === candidateFocus.value);
        if (candidateFocus?.type === "zodiac") return candidateReport.allZodiacs.find((item)=>item.zodiac === candidateFocus.value);
        if (candidateTab.startsWith("zodiacs")) return candidateReport.topZodiacs9[0];
        return candidateReport.topNumbers8[0] ?? candidateReport.topNumbers18[0];
    }, [
        activeView,
        candidateFocus,
        candidateReport,
        candidateTab
    ]);
    const drawColumns = [
        {
            accessorKey: "issue",
            header: "期号"
        },
        {
            header: "来源",
            cell: ({ row })=>isManualDrawRecord(row.original) ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                    tone: "cyan",
                    children: "人工录入"
                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                    tone: row.original.sourceUrl ? "green" : "slate",
                    children: row.original.sourceUrl ? "网站/云端" : "本地"
                })
        },
        {
            accessorKey: "date",
            header: "日期",
            cell: ({ row })=>row.original.date ?? "-"
        },
        {
            header: "L序",
            cell: ({ row })=>codeValue(row.original.lOrder.map((n)=>rulequant_terminal_numberWithZodiac(n, config)).join(" "))
        },
        {
            header: "D序",
            cell: ({ row })=>codeValue(row.original.dOrder.map((n)=>rulequant_terminal_numberWithZodiac(n, config)).join(" "))
        },
        {
            header: "特码",
            cell: ({ row })=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                    tone: "cyan",
                    children: rulequant_terminal_numberWithZodiac(row.original.special, config)
                })
        },
        {
            header: "特码属性",
            cell: ({ row })=>`${row.original.specialAttributes.zodiac} / ${row.original.specialAttributes.color} / ${row.original.specialAttributes.element}`
        },
        {
            header: "总数",
            cell: ({ row })=>codeValue(row.original.total)
        }
    ];
    const detailColumns = [
        {
            accessorKey: "currentIssue",
            header: "当前期"
        },
        {
            accessorKey: "nextIssue",
            header: "下期"
        },
        {
            header: "raw",
            cell: ({ row })=>codeValue(row.original.rawResult)
        },
        {
            header: "输出",
            cell: ({ row })=>row.original.mappedResult.join("、")
        },
        {
            accessorKey: "targetLabel",
            header: "对象 / 集合"
        },
        {
            header: "结果",
            cell: ({ row })=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                    tone: row.original.success ? "green" : "rose",
                    children: row.original.success ? "通过" : "失败"
                })
        }
    ];
    const fetchSourceDraws = (0,react.useCallback)(async (syncPreview = true, saveMode = "replace")=>{
        setSourceLoading(true);
        setSourceStatus("正在同步配置的开奖源数据，请稍候...");
        try {
            const isGithubPagesHost =  true && window.location.hostname.endsWith("github.io");
            const endpoint = "/api/import-draws-from-url";
            const fallbackEndpoint = REMOTE_DRAW_IMPORT_ENDPOINT;
            const payload = {
                baseUrl: sourceUrl,
                fromYear: Number(sourceFromYear),
                toYear: Number(sourceToYear),
                persist: false
            };
            const request = async (url)=>{
                const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload),
                    cache: "no-store"
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.errors?.[0] ?? "网址数据抓取失败");
                return data;
            };
            const requestStaticSnapshot = async ()=>{
                let lastError = "";
                for (const url of staticCloudStateUrls()){
                    try {
                        const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
                            cache: "no-store"
                        });
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        const state = await response.json();
                        if (!Array.isArray(state.draws) || !state.draws.length) throw new Error("static snapshot missing draws");
                        return {
                            records: state.draws,
                            years: [
                                {
                                    year: Number(sourceFromYear),
                                    url,
                                    count: state.draws.length
                                }
                            ],
                            errors: [],
                            fetchedAt: state.meta?.updatedAt,
                            latestIssue: state.meta?.latestIssue,
                            recordCount: state.meta?.recordCount ?? state.draws.length,
                            state: state.meta
                        };
                    } catch (error) {
                        lastError = error instanceof Error ? error.message : String(error);
                    }
                }
                throw new Error(`Static draw snapshot unavailable: ${lastError || "unknown error"}`);
            };
            let data;
            if (isGithubPagesHost) {
                data = await requestStaticSnapshot();
            } else try {
                data = await request(endpoint);
            } catch (primaryError) {
                if (fallbackEndpoint.startsWith("/")) {
                    throw primaryError;
                } else {
                    data = await request(fallbackEndpoint);
                }
            }
            const fetchedRecords = data.records ?? [];
            if (!fetchedRecords.length) {
                throw new Error("网站本次没有返回有效开奖记录，已保留现有开奖库");
            }
            const fetchedSorted = rulequant_terminal_sortDrawRecords(fetchedRecords);
            const latestFetched = fetchedSorted.at(-1);
            const currentLatest = rulequant_terminal_sortDrawRecords(activeDraws).at(-1);
            const syncedAt = new Date().toLocaleString("zh-CN", {
                hour12: false
            });
            setLastSyncAt(syncedAt);
            localStorage.setItem("rulequant:lastSyncAt", syncedAt);
            localStorage.setItem("rulequant:lastSyncedIssue", latestFetched?.issue ?? "");
            setSourceRecords(fetchedRecords);
            setSourceSummaries(data.years ?? []);
            setImportErrors(data.errors ?? []);
            if (syncPreview) setPreviewDraws(fetchedRecords);
            if (saveMode === "replace") {
                await store.replaceDraws(fetchedRecords);
            } else if (saveMode === "merge") {
                await store.importDraws(fetchedRecords);
            }
            if (data.state?.latestIssue) {
                await store.hydrate();
            }
            clearCandidatePoolCache();
            setReferenceRunId((current)=>current + 1);
            const changed = latestFetched?.issue && latestFetched.issue !== currentLatest?.issue;
            setSourceStatus(changed ? `已同步到最新 ${latestFetched.issue} 期，共 ${fetchedRecords.length} 条记录，页面已重新计算。` : `已检查配置的开奖源，当前仍为 ${latestFetched?.issue ?? "-"} 期，共 ${fetchedRecords.length} 条记录。`);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setImportErrors([
                message
            ]);
            setSourceStatus(`同步失败：${message}`);
        } finally{
            setSourceLoading(false);
        }
    }, [
        activeDraws,
        sourceUrl,
        sourceFromYear,
        sourceToYear,
        store
    ]);
    (0,react.useEffect)(()=>{
        if (!hasHydrated || sourceLoading || !WEBSITE_FIRST_VIEWS.has(activeView)) return;
        const syncLatest = ()=>{
            const now = Date.now();
            if (now - sourceAutoFetchedAt.current < AUTO_SYNC_INTERVAL_MS) return;
            sourceAutoFetchedAt.current = now;
            void fetchSourceDraws(false, "none");
        };
        queueMicrotask(syncLatest);
        const timer = window.setInterval(syncLatest, AUTO_SYNC_INTERVAL_MS);
        return ()=>window.clearInterval(timer);
    }, [
        activeView,
        fetchSourceDraws,
        hasHydrated,
        sourceLoading
    ]);
    async function handleParseImport() {
        const result = parseDrawText(importText);
        setPreviewDraws(result.records);
        setImportErrors(result.errors);
    }
    async function handlePublishCloudState() {
        if ( true && !window.localStorage.getItem("rulequant:adminToken") && !rulequant_terminal_process.env.NEXT_PUBLIC_RULEQUANT_ADMIN_TOKEN) {
            const token = window.prompt("云端设置了管理员密钥。请输入管理员发布密钥；如果没有，直接取消，本机数据仍会保留。");
            if (!token?.trim()) return;
            window.localStorage.setItem("rulequant:adminToken", token.trim());
        }
        await store.publishCloudState("manual");
    }
    async function handleFile(file) {
        if (!file) return;
        const result = await parseDrawFile(file);
        setPreviewDraws(result.records);
        setImportErrors(result.errors);
    }
    async function handleRuleLibraryFile(file) {
        if (!file) return;
        setRuleLibraryStatus("");
        try {
            const text = await file.text();
            if (/\.txt$/i.test(file.name) || file.type === "text/plain") {
                const result = parseRuleTextFile(text, file.name);
                if (!result.rules.length) {
                    setRuleLibraryStatus(`TXT 公式识别失败：${result.errors.join("；") || "未识别到公式"}`);
                    return;
                }
                const libraryResult = await store.addRulesToLibrary(result.rules.map((rule)=>({
                        ...rule,
                        sourceType: "txt_import",
                        origin: file.name,
                        fromTextId: file.name
                    })), `TXT 导入公式：${file.name}`);
                const warningText = result.warnings.length ? ` 提醒：${result.warnings.join("；")}` : "";
                setRuleLibraryStatus(`TXT 规则入库完成：新增 ${libraryResult.added.length} 条，重复 ${libraryResult.duplicates.length} 条，失败 ${libraryResult.failed.length} 条。${warningText}`);
                return;
            }
            const parsed = JSON.parse(text);
            const records = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && Array.isArray(parsed.rules) ? parsed.rules : [];
            const validRules = records.filter((item)=>{
                if (!item || typeof item !== "object") return false;
                const rule = item;
                return Boolean(rule.id && rule.name && rule.category && rule.orderMode && rule.formula);
            });
            if (!validRules.length) {
                setRuleLibraryStatus("导入失败：JSON 里没有识别到有效公式。");
                return;
            }
            await store.importRules(validRules);
            setRuleLibraryStatus(`已导入 ${validRules.length} 条公式。`);
        } catch (error) {
            setRuleLibraryStatus(`导入失败：${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async function handleImportPreview() {
        await store.importDraws(previewDraws);
        setPreviewDraws([]);
        setImportText("");
    }
    async function replaceLocalDrawsWithSourceRecords() {
        if (!sourceRecords.length) {
            setSourceStatus("暂无可替换的网站开奖记录，已保留现有开奖库");
            return;
        }
        await store.replaceDraws(sourceRecords);
        const syncedAt = new Date().toLocaleString("zh-CN", {
            hour12: false
        });
        setLastSyncAt(syncedAt);
        localStorage.setItem("rulequant:lastSyncAt", syncedAt);
        setSourceStatus(`已用网址 ${sourceRecords.length} 条记录替换本地开奖库`);
    }
    function buildManualDrawRecord() {
        const now = new Date();
        const issueInput = String(manualDraw.issue || "").trim();
        const issue = !issueInput || issueInput.toLowerCase() === "manual" ? `manual-${now.toISOString().slice(0, 19).replace(/[-:T]/g, "")}` : issueInput;
        return {
            ...manualDraw,
            issue,
            date: manualDraw.date || now.toISOString().slice(0, 10),
            year: manualDraw.year ?? now.getFullYear(),
            sourceUrl: "manual://user-input",
            rawAttributes: {
                ...manualDraw.rawAttributes ?? {},
                sourceType: "manual",
                label: "人工录入",
                note: "一键算公式页面手动输入保存",
                savedAt: now.toISOString()
            }
        };
    }
    async function saveManualDraw() {
        const record = buildManualDrawRecord();
        const numbers = [
            record.n1,
            record.n2,
            record.n3,
            record.n4,
            record.n5,
            record.n6,
            record.special
        ];
        if (!manualDrawValidation.valid) {
            setOneClickStatus(`保存失败：${manualDrawValidation.errors.join("；")}`);
            return;
        }
        const hasInvalidNumber = numbers.some((value)=>!Number.isInteger(value) || value < 1 || value > 49);
        if (hasInvalidNumber) {
            setOneClickStatus("保存失败：开奖号码必须是 1-49 的整数。");
            return;
        }
        await store.importDraws([
            record
        ]);
        setManualDraw(record);
        clearCandidatePoolCache();
        setReferenceRunId((current)=>current + 1);
        const savedAt = new Date().toLocaleString("zh-CN", {
            hour12: false
        });
        setLastSyncAt(savedAt);
        localStorage.setItem("rulequant:lastSyncAt", savedAt);
        setSourceStatus(`已保存人工录入开奖：${record.issue}，${drawNumbersWithZodiac(record, config)}。开奖数据页顶部会单独显示。`);
        setOneClickStatus(`已保存人工录入开奖 ${record.issue}，后续计算会标记为人工数据；可在“开奖数据”页顶部查看。`);
        await store.addOperationLog({
            type: "sync_draws",
            message: `人工录入开奖：${record.issue}`,
            issue: record.issue,
            dataCount: activeDraws.length + 1,
            details: {
                sourceType: "manual",
                numbers
            }
        });
    }
    async function deleteManualDraw(issue) {
        if (!window.confirm(`确认删除人工录入开奖「${issue}」吗？删除后不再参与计算。`)) return;
        await store.deleteDraw(issue);
        setSourceRecords((current)=>current.filter((record)=>!(record.issue === issue && isManualDrawRecord(record))));
        clearCandidatePoolCache();
        setReferenceRunId((current)=>current + 1);
        setSourceStatus(`已删除人工录入开奖：${issue}。`);
        setOneClickStatus(`已删除人工录入开奖 ${issue}，后续计算不会再使用这条人工数据。`);
    }
    function handleOneClickCalculate() {
        if (oneClickMode === "manual" && !manualDrawValidation.valid) {
            setOneClickStatus(`计算失败：${manualDrawValidation.errors.join("；")}`);
            return;
        }
        setOneClickCalculating(true);
        setOneClickStatus("正在计算全部启用公式...");
        window.setTimeout(()=>{
            const now = new Date().toLocaleString("zh-CN", {
                hour12: false
            });
            setLastCalculationAt(now);
            localStorage.setItem("rulequant:lastCalculationAt", now);
            setOneClickStatus(`已计算 ${oneClickResults.length} 条公式，使用期号 ${selectedOneClickDraw.issue}。`);
            setOneClickCalculating(false);
            void store.addOperationLog({
                type: "one_click_calculate",
                message: `一键计算全部公式：启用 ${enabledRuleCount} 条，可参与 ${referenceRuleCount} 条`,
                issue: selectedOneClickDraw.issue,
                dataCount: activeDraws.length,
                formulaCount: referenceRuleCount
            });
        }, 0);
    }
    async function saveReferenceReport(report, saveType, note) {
        if (!report.ruleCount || !report.signalCount) {
            setReferenceStatus("当前没有可保存的综合推荐记录：公式依据为空。");
            return;
        }
        const record = buildReferenceHistoryItem({
            report,
            saveType,
            dataSourceLabel,
            recordCount: activeDraws.length,
            note
        });
        await store.saveReferenceHistory(record);
        setReferenceStatus(`已保存 ${record.baseIssue ?? "-"} 期综合推荐档案：Top8/12/16/18、全量49号码、生肖Top7/8/9、全量12生肖和证据摘要都已入库。`);
    }
    function saveReferenceArchiveForIssue(issue) {
        const targetIssue = issue.trim();
        if (!targetIssue) {
            setReferenceStatus("请选择要复盘保存的基准期号。");
            return;
        }
        const sorted = rulequant_terminal_sortDrawRecords(activeDraws);
        const targetIndex = sorted.findIndex((draw)=>draw.issue === targetIssue);
        if (targetIndex < 1) {
            setReferenceStatus("这个期号前面的历史数据不足，无法生成历史预测复盘。");
            return;
        }
        setReferenceArchiveSaving(true);
        window.setTimeout(async ()=>{
            try {
                const archiveDraws = sorted.slice(0, targetIndex + 1);
                const archiveBacktest = (0,run_backtest/* runBacktest */.rt)({
                    draws: archiveDraws,
                    rules,
                    config
                });
                const archiveReport = generateCandidatePool({
                    draws: archiveDraws,
                    rules,
                    config,
                    backtest: archiveBacktest,
                    validationSummaries: ruleValidationSummaries
                });
                if (!archiveReport.ruleCount || !archiveReport.signalCount) {
                    setReferenceStatus("这期没有生成可保存的公式依据，请检查公式是否启用且可计算。");
                    return;
                }
                const record = buildReferenceHistoryItem({
                    report: archiveReport,
                    saveType: "manual",
                    dataSourceLabel,
                    recordCount: archiveDraws.length,
                    note: `历史复盘：按 ${archiveReport.latestIssue ?? targetIssue} 期及以前数据生成`
                });
                await store.saveReferenceHistory(record);
                await store.addOperationLog({
                    type: "generate_reference",
                    message: `历史复盘保存：${record.baseIssue ?? targetIssue} 期，${record.ruleCount} 条公式，${record.signalCount} 条依据`,
                    issue: record.baseIssue ?? targetIssue,
                    dataCount: archiveDraws.length,
                    formulaCount: record.ruleCount,
                    signalCount: record.signalCount
                });
                setReferenceStatus(`已保存 ${record.baseIssue ?? targetIssue} 期历史预测复盘；如果下一期已开奖，档案会自动对比命中情况。`);
            } finally{
                setReferenceArchiveSaving(false);
            }
        }, 0);
    }
    function handleRegenerateReference() {
        setReferenceCalculating(true);
        window.setTimeout(()=>{
            clearCandidatePoolCache();
            const freshReport = generateCandidatePool({
                draws: researchDraws,
                rules,
                config,
                backtest: candidateBacktest,
                validationSummaries: ruleValidationSummaries
            });
            const generatedAt = new Date().toISOString();
            const calculatedAt = new Date(generatedAt).toLocaleString("zh-CN", {
                hour12: false
            });
            setReferenceRunId((current)=>current + 1);
            setReferenceGeneratedAt(generatedAt);
            setLastCalculationAt(calculatedAt);
            localStorage.setItem("rulequant:lastCalculationAt", calculatedAt);
            void store.addOperationLog({
                type: "generate_reference",
                message: `重新生成综合参考结果：${freshReport.ruleCount} 条公式参与，生成 ${freshReport.signalCount} 条依据`,
                issue: freshReport.latestIssue,
                dataCount: activeDraws.length,
                formulaCount: freshReport.ruleCount,
                signalCount: freshReport.signalCount,
                details: {
                    latestNumbers: freshReport.latestNumbers,
                    excludedRuleCount,
                    exceptionRuleCount: exceptionRules.length
                }
            });
            setCandidateFocus(null);
            setReferenceStatus(`已使用 ${freshReport.latestIssue ?? "-"} 期数据，${freshReport.ruleCount} 条公式参与计算，生成 ${freshReport.signalCount} 条公式依据。`);
            void saveReferenceReport(freshReport, "auto", "重新生成综合参考结果自动保存");
            setReferenceCalculating(false);
        }, 0);
    }
    function updateManualDraw(key, value) {
        setOneClickMode("manual");
        setManualDraw((current)=>({
                ...current,
                [key]: key === "issue" || key === "date" || key === "sourceUrl" ? value : Number(value || 0)
            }));
    }
    function repairManualDrawNumber(key) {
        setManualDraw((current)=>({
                ...current,
                [key]: normalizeManualDrawNumber(current[key])
            }));
    }
    function stepManualDrawNumber(key, step) {
        setOneClickMode("manual");
        setManualDraw((current)=>({
                ...current,
                [key]: normalizeManualDrawNumber(Number(current[key]) + step)
            }));
    }
    async function addDiscoveredRule(rule) {
        setDiscoveryStatus("");
        const now = new Date().toISOString();
        const result = await store.addRuleToLibrary({
            ...rule,
            id: undefined,
            enabled: true,
            manuallyConfirmed: true,
            participatesInReference: true,
            sourceType: "system_recommended",
            origin: "公式筛选",
            fromCandidateId: rule.id,
            parseStatus: "parsed",
            verifyStatus: "unchecked",
            name: `${rule.name}（已加入）`,
            createdAt: now,
            updatedAt: now
        }, "确认系统推荐公式");
        if (result.ok) {
            setDiscoveryFocusId(rule.id);
            setDiscoveryStatus(`已加入公式库：${result.rule.name}`);
        } else if (result.duplicate) {
            store.setSelectedRule(result.duplicate.id);
            setDiscoveryStatus(`这条公式已在公式库中：${result.duplicate.name}`);
        } else {
            setDiscoveryStatus(`加入失败：${result.reason}`);
        }
    }
    async function saveRuleFromForm(formData) {
        const rawId = String(formData.get("id") || "");
        const existingRule = rawId ? rules.find((rule)=>rule.id === rawId) : undefined;
        const rule = buildRuleFromFormData(formData, {
            existingRule,
            forceNew: !existingRule
        });
        const drawForValidation = latestDraw ?? normalizedDraws[0];
        if (drawForValidation) {
            try {
                runRuleCalculation(rule, drawForValidation, config, {
                    periodIndex: latestDraw ? latestPeriodIndex : 0
                });
            } catch (error) {
                return {
                    ok: false,
                    message: `公式暂不能保存：${error instanceof Error ? error.message : String(error)}`
                };
            }
        }
        const result = await store.upsertRule(rule);
        if (!result.ok) {
            if (result.duplicate) {
                store.setSelectedRule(result.duplicate.id);
                setRuleFilter("all");
                setRuleLibraryFilter("all");
                return {
                    ok: false,
                    message: `这条规则已存在于公式库：${result.duplicate.name}`,
                    duplicate: result.duplicate
                };
            }
            return {
                ok: false,
                message: `保存失败：${result.reason}`
            };
        }
        store.setSelectedRule(result.rule.id);
        setRuleFilter("all");
        setRuleLibraryFilter("all");
        setRuleSort("smart");
        clearCandidatePoolCache();
        setReferenceRunId((current)=>current + 1);
        return {
            ok: true,
            rule: result.rule,
            message: `${result.message}：${result.rule.name}。公式管理默认会显示全部公式。`
        };
    }
    async function saveSample() {
        const mapped = sampleDraft.expectedMappedResult.split(/[,，、\s]+/).filter(Boolean).map((item)=>Number.isFinite(Number(item)) ? Number(item) : item);
        const sample = {
            id: `sample-${Date.now()}`,
            ruleId: sampleDraft.ruleId,
            issue: sampleDraft.issue,
            expectedRawResult: sampleDraft.expectedRawResult ? Number(sampleDraft.expectedRawResult) : undefined,
            expectedFinalResult: sampleDraft.expectedFinalResult ? Number(sampleDraft.expectedFinalResult) : undefined,
            expectedMappedResult: mapped.length ? mapped : undefined,
            expectedSuccess: sampleDraft.expectedSuccess === "true",
            sourceFile: "手动录入"
        };
        await store.upsertSample(sample);
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "min-h-screen overflow-x-hidden bg-[#05080d] text-slate-100",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(120deg,rgba(8,145,178,0.07),transparent_38%,rgba(124,58,237,0.055)_72%,transparent)]"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[228px_1fr]",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("aside", {
                        className: "sticky top-0 hidden h-screen border-r border-white/[0.08] bg-[#071017]/88 p-4 backdrop-blur-xl lg:block",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                                href: "/dashboard",
                                className: "mb-6 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300/15 text-cyan-200",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(braces/* default */.A, {
                                            className: "h-5 w-5"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "font-semibold text-white",
                                                children: "RuleQuant"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "text-xs text-slate-500",
                                                children: "规则回测终端"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("nav", {
                                className: "space-y-1",
                                children: navItems.map((item)=>{
                                    const Icon = item.icon;
                                    const active = item.key === activeView;
                                    return /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                                        href: item.href,
                                        className: cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm transition", active ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"),
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                                                className: "h-4 w-4"
                                            }),
                                            item.label
                                        ]
                                    }, item.key);
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("nav", {
                        className: "fixed inset-x-0 bottom-0 z-50 w-screen max-w-[100vw] overflow-hidden border-t border-white/[0.10] bg-[#05080d]/94 px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:hidden",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "grid min-w-0 grid-cols-4 gap-1",
                            children: mobileNavItems.map((item)=>{
                                const Icon = item.icon;
                                const active = item.key === activeView;
                                return /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                                    href: item.href,
                                    className: cn("flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] leading-none transition", active ? "border border-cyan-300/25 bg-cyan-300/12 text-cyan-100" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"),
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                                            className: "h-4 w-4"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "max-w-full truncate",
                                            children: item.label
                                        })
                                    ]
                                }, item.key);
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("main", {
                        className: "min-w-0 max-w-full overflow-x-hidden pb-[calc(104px+env(safe-area-inset-bottom))] lg:pb-0",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("header", {
                                className: "sticky top-0 z-20 border-b border-white/[0.08] bg-[#05080d]/90 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "min-w-0 sm:shrink-0",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                    className: "text-xs uppercase tracking-[0.24em] text-cyan-200/70",
                                                    children: "开奖数据 \xb7 公式计算 \xb7 综合参考"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                                                    className: "mt-1 break-words text-[22px] font-semibold leading-tight text-white sm:text-[28px]",
                                                    children: viewLabels[activeView]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "flex min-w-0 max-w-full flex-wrap items-center gap-2 text-xs text-slate-400 sm:flex-1 sm:justify-end",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                    tone: hasSharedDraws ? "green" : "slate",
                                                    children: dataSourceLabel
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                    children: [
                                                        "最新期：",
                                                        latestRawDraw?.issue ?? "-"
                                                    ]
                                                }),
                                                showCloudPublishControls && cloudPublishMessage && /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                    tone: cloudPublishStatus === "published" ? "green" : cloudPublishStatus === "failed" ? "rose" : "yellow",
                                                    children: cloudPublishMessage
                                                }),
                                                showCloudPublishControls && /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                    size: "sm",
                                                    loading: cloudPublishStatus === "publishing",
                                                    onClick: ()=>void handlePublishCloudState(),
                                                    children: "发布云端"
                                                }),
                                                showCloudPublishControls && lastCloudPublishAt && /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                    children: [
                                                        "云端：",
                                                        new Date(lastCloudPublishAt).toLocaleString("zh-CN", {
                                                            hour12: false
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(proxy/* motion */.P.div, {
                                initial: false,
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: 0.22
                                },
                                className: "rq-content mx-auto w-full max-w-[1720px] p-3 sm:p-5 lg:p-6",
                                children: [
                                    activeView === "dashboard" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                        tone: "cyan",
                                                        children: "RuleQuant 回测终端"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "mt-3 text-[24px] font-semibold leading-tight text-white sm:text-[28px]",
                                                        children: "今日公式计算工作台"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mt-2 max-w-3xl text-sm leading-6 text-slate-400",
                                                        children: "先同步今年完整开奖数据，再一键代入公式，最后查看综合参考结果。当前页面只保留日常工作最常用的三步。"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_.9fr]",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                        className: "p-5",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-start justify-between gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                className: "font-semibold text-white",
                                                                                children: "1. 开奖数据状态"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "mt-1 text-sm text-slate-500",
                                                                                children: "同步后会直接使用网站全年数据重新计算。"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                        tone: hasSharedDraws ? "green" : "yellow",
                                                                        children: dataSourceLabel
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "mt-5 flex w-full max-w-[342px] flex-wrap gap-2 sm:max-w-full",
                                                                children: latestRawDraw ? [
                                                                    latestRawDraw.n1,
                                                                    latestRawDraw.n2,
                                                                    latestRawDraw.n3,
                                                                    latestRawDraw.n4,
                                                                    latestRawDraw.n5,
                                                                    latestRawDraw.n6,
                                                                    latestRawDraw.special
                                                                ].map((number, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(NumberTile, {
                                                                        number: number,
                                                                        special: index === 6,
                                                                        config: config
                                                                    }, `${number}-${index}`)) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                    className: "text-slate-500",
                                                                    children: "暂无开奖数据"
                                                                })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mt-5 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        children: [
                                                                            "最新期号：",
                                                                            latestRawDraw?.issue ?? "-"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        children: [
                                                                            "已同步期数：",
                                                                            sourceRecords.length || activeDraws.length
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        children: [
                                                                            "最后同步：",
                                                                            displayLastSyncAt || "未同步"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        children: [
                                                                            "是否使用最新同步数据：",
                                                                            isUsingSyncedData ? "是" : "否"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                className: "mt-5",
                                                                variant: "primary",
                                                                disabled: sourceLoading,
                                                                onClick: ()=>void fetchSourceDraws(true, "replace"),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    sourceLoading ? "同步中" : "同步配置开奖源"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                        className: "p-5",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-start justify-between gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                className: "font-semibold text-white",
                                                                                children: "2. 一键算公式"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "mt-1 text-sm text-slate-500",
                                                                                children: "把最新一期代入全部启用公式。"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                        tone: "cyan",
                                                                        children: [
                                                                            "上次计算 ",
                                                                            lastCalculationAt || "未计算"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                        label: "启用公式",
                                                                        value: enabledRuleCount,
                                                                        tone: "green"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                        label: "可参与参考",
                                                                        value: referenceRuleCount,
                                                                        tone: "cyan"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                        label: "未做样例核对",
                                                                        value: pendingRuleCount,
                                                                        tone: "yellow"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                className: "mt-5 w-full",
                                                                variant: "primary",
                                                                disabled: oneClickCalculating,
                                                                onClick: handleOneClickCalculate,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(play/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    oneClickCalculating ? "正在计算..." : "一键计算全部公式"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                                href: "/one-click",
                                                                className: "mt-3 inline-flex text-sm text-cyan-200 hover:text-cyan-100",
                                                                children: "查看每条公式本期计算结果"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-col items-start justify-between gap-4 lg:flex-row",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                        className: "font-semibold text-white",
                                                                        children: "3. 综合参考结果"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 text-sm text-slate-500",
                                                                        children: "本结果由历史公式表现和最新一期公式计算结果综合生成，仅供参考。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                tone: "green",
                                                                children: [
                                                                    "参与公式 ",
                                                                    candidateReport.ruleCount
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[.9fr_1.1fr]",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mb-2 text-xs text-slate-500",
                                                                        children: "参考生肖 Top 9"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "flex flex-wrap gap-2",
                                                                        children: candidateReport.topZodiacs9.length ? candidateReport.topZodiacs9.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                tone: "violet",
                                                                                children: item.zodiac
                                                                            }, item.zodiac)) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: "暂无可用证据"
                                                                        })
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mb-2 text-xs text-slate-500",
                                                                        children: "重点号码 Top 8"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8",
                                                                        children: candidateReport.topNumbers8.length ? candidateReport.topNumbers8.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "flex h-10 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] px-1 font-mono text-xs text-white",
                                                                                children: candidateNumberLabel(item)
                                                                            }, item.number)) : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                            className: "col-span-full text-sm text-slate-500",
                                                                            children: "暂无可用证据，请检查公式是否已启用、可计算且未被手动排除。"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-2 text-xs text-slate-500",
                                                                        children: "嫌号码太多时先看这里；需要放宽再进综合参考页看 Top 12 / Top 18。"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                        href: "/candidate-pool",
                                                        className: "mt-5 inline-flex text-sm text-cyan-200 hover:text-cyan-100",
                                                        children: "查看详细原因和证据"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "grid grid-cols-1 gap-4 xl:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaExceptionPanel, {
                                                        items: exceptionRules,
                                                        calculableCount: calculableRuleCount
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(OperationLogPanel, {
                                                        logs: operationLogs
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaHealthPanel, {
                                                rows: ruleHealthRows,
                                                onToggleReserve: (ruleId)=>void store.toggleReferenceParticipation(ruleId)
                                            })
                                        ]
                                    }),
                                    activeView === "one-click" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-4 sm:p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "一键算公式"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 text-sm text-slate-500",
                                                                        children: "默认使用今年网站完整开奖数据的最新一期，也可以手动输入一期开奖。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                className: "w-full sm:w-auto",
                                                                variant: "primary",
                                                                disabled: oneClickCalculating,
                                                                onClick: handleOneClickCalculate,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(play/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    oneClickCalculating ? "正在计算..." : "一键计算全部公式"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr]",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                        children: "计算方式"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                                        value: oneClickMode,
                                                                        onChange: (event)=>setOneClickMode(event.target.value),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                                value: "latest",
                                                                                children: "使用最新同步开奖"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                                value: "manual",
                                                                                children: "手动输入一期开奖"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-4 text-sm text-slate-400",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                children: [
                                                                                    "当前期号：",
                                                                                    selectedOneClickDraw.issue
                                                                                ]
                                                                            }),
                                                                            (selectedOneClickDraw.sourceUrl === "manual://user-input" || selectedOneClickDraw.rawAttributes?.sourceType === "manual") && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "mt-1 text-cyan-100",
                                                                                children: "数据标记：人工录入"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                children: [
                                                                                    "开奖号码：",
                                                                                    drawNumbersWithZodiac(selectedOneClickDraw, config)
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                children: [
                                                                                    "上次计算：",
                                                                                    lastCalculationAt || "未计算"
                                                                                ]
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            oneClickMode === "manual" ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "min-h-[112px] rounded-md border border-white/[0.08] bg-white/[0.03] p-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                                        children: "期号"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                        className: !String(manualDraw.issue ?? "").trim() ? "border-amber-300/40" : "",
                                                                                        value: manualDraw.issue,
                                                                                        onChange: (event)=>updateManualDraw("issue", event.target.value)
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                        className: "mt-2 text-[11px] leading-4 text-slate-500",
                                                                                        children: "不填或填 manual 会自动生成唯一期号"
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            MANUAL_DRAW_KEYS.map((key, index)=>{
                                                                                const invalid = manualDrawValidation.invalidKeys.has(key);
                                                                                const duplicated = manualDrawValidation.duplicatedValues.includes(Number(manualDraw[key]));
                                                                                const isSpecial = key === "special";
                                                                                return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                    className: cn("min-h-[112px] rounded-md border p-3", isSpecial ? "border-cyan-300/28 bg-cyan-300/[0.07]" : "border-white/[0.08] bg-white/[0.03]", invalid && "border-amber-300/45 bg-amber-300/[0.07]", duplicated && "border-rose-300/45 bg-rose-300/[0.08]"),
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                                            children: isSpecial ? "特码" : `第${index + 1}位`
                                                                                        }),
                                                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                            className: "mt-1 grid grid-cols-[32px_1fr_32px] gap-1",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                    type: "button",
                                                                                                    size: "icon",
                                                                                                    className: "h-10 min-w-8",
                                                                                                    onClick: ()=>stepManualDrawNumber(key, -1),
                                                                                                    children: "-"
                                                                                                }),
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                                    type: "number",
                                                                                                    min: 1,
                                                                                                    max: 49,
                                                                                                    inputMode: "numeric",
                                                                                                    className: cn("text-center font-mono text-[18px]", invalid && "border-amber-300/50", duplicated && "border-rose-300/50"),
                                                                                                    value: manualDraw[key],
                                                                                                    onChange: (event)=>updateManualDraw(key, event.target.value),
                                                                                                    onBlur: ()=>repairManualDrawNumber(key),
                                                                                                    onWheel: (event)=>event.currentTarget.blur()
                                                                                                }),
                                                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                    type: "button",
                                                                                                    size: "icon",
                                                                                                    className: "h-10 min-w-8",
                                                                                                    onClick: ()=>stepManualDrawNumber(key, 1),
                                                                                                    children: "+"
                                                                                                })
                                                                                            ]
                                                                                        }),
                                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                            className: cn("mt-1 text-center text-[11px]", invalid || duplicated ? "text-rose-100" : isSpecial ? "text-cyan-100/70" : "text-slate-500"),
                                                                                            children: invalid ? "离开输入框会自动修正" : duplicated ? "重复号码，请改一个" : rulequant_terminal_numberWithZodiac(Number(manualDraw[key]), config)
                                                                                        })
                                                                                    ]
                                                                                }, key);
                                                                            })
                                                                        ]
                                                                    }),
                                                                    manualDrawValidation.errors.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "rounded-md border border-amber-300/25 bg-amber-300/[0.08] p-3 text-sm text-amber-50",
                                                                        children: [
                                                                            "请修正后再计算：",
                                                                            manualDrawValidation.errors.join("；"),
                                                                            "。超出范围的号码离开输入框会自动调整到 1-49。"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "grid gap-2 sm:flex sm:flex-wrap",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                                className: "w-full sm:w-auto",
                                                                                type: "button",
                                                                                disabled: !manualDrawValidation.valid,
                                                                                onClick: ()=>void saveManualDraw(),
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                                        className: "h-4 w-4"
                                                                                    }),
                                                                                    "保存人工开奖"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                                className: "w-full sm:w-auto",
                                                                                type: "button",
                                                                                variant: "primary",
                                                                                disabled: oneClickCalculating || !manualDrawValidation.valid,
                                                                                onClick: handleOneClickCalculate,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(play/* default */.A, {
                                                                                        className: "h-4 w-4"
                                                                                    }),
                                                                                    "计算当前手动开奖"
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] p-3 text-xs leading-5 text-cyan-50/85",
                                                                        children: "手动输入会保存为“人工录入”数据，开奖数据页会单独显示，公式计算仍会合并使用。"
                                                                    })
                                                                ]
                                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "rounded-lg border border-white/[0.08] bg-black/20 p-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "text-sm text-slate-500",
                                                                        children: [
                                                                            "数据来源：",
                                                                            dataSourceLabel
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-2 text-[28px] font-semibold leading-none text-white",
                                                                        children: selectedOneClickDraw.issue
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-2 font-mono text-cyan-100",
                                                                        children: latestNumbersLabel
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    oneClickStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: cn("mt-4 rounded-lg border p-3 text-sm", oneClickStatus.includes("失败") ? "border-rose-300/25 bg-rose-300/10 text-rose-100" : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"),
                                                        children: oneClickStatus
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-4 flex items-center justify-between gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                        className: "font-semibold text-white",
                                                                        children: "全部公式本期计算结果"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: "每条公式一行，点“查看明细”进入逐期计算流水账。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                tone: oneClickMode === "manual" && !manualDrawValidation.valid ? "yellow" : "green",
                                                                children: oneClickMode === "manual" && !manualDrawValidation.valid ? "等待修正" : `${oneClickResults.length} 条启用公式`
                                                            })
                                                        ]
                                                    }),
                                                    oneClickMode === "manual" && !manualDrawValidation.valid ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "rounded-lg border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm leading-6 text-amber-50",
                                                        children: "当前手动开奖还没填完整，系统已暂停公式计算，避免生成错误结果。把号码修正到 1-49 且不重复后，结果会自动恢复。"
                                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "rq-heavy-list space-y-3",
                                                        children: oneClickResults.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(OneClickResultCard, {
                                                                item: item,
                                                                categoryLabel: categoryLabel(item.category),
                                                                onOpen: ()=>store.setSelectedRule(item.ruleId)
                                                            }, item.ruleId))
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    activeView === "formula-detail" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-4 sm:p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "公式逐期明细"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 text-sm text-slate-500",
                                                                        children: "像图片里的流水账一样，逐期检查公式怎么算、哪期对、哪期错。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex min-w-0 flex-col gap-2 lg:items-end",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                        className: "w-fit max-w-full whitespace-normal py-1 leading-4",
                                                                        tone: hasSharedDraws ? "green" : "rose",
                                                                        children: [
                                                                            "当前验证数据：",
                                                                            dataSourceLabel,
                                                                            " \xb7 ",
                                                                            activeDraws.length,
                                                                            "期"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[auto_1fr] lg:w-auto lg:grid-cols-[auto_320px]",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                                className: "w-full sm:w-auto",
                                                                                disabled: sourceLoading,
                                                                                onClick: ()=>void fetchSourceDraws(false, "replace"),
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                                        className: "h-4 w-4"
                                                                                    }),
                                                                                    "同步网站全年数据"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                                                className: "w-full min-w-0",
                                                                                value: selectedRuleId,
                                                                                onChange: (event)=>store.setSelectedRule(event.target.value),
                                                                                children: rules.map((rule)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                                        value: rule.id,
                                                                                        children: rule.name
                                                                                    }, rule.id))
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    selectedRuleLedger && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "验证期数",
                                                                value: selectedRuleLedger.summary.total
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "正确",
                                                                value: selectedRuleLedger.summary.success,
                                                                tone: "green"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "错误",
                                                                value: selectedRuleLedger.summary.failed,
                                                                tone: "rose"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "成功率",
                                                                value: `${selectedRuleLedger.summary.successRate}%`
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "当前连对",
                                                                value: selectedRuleLedger.summary.currentStreak,
                                                                tone: "violet"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "最大连对",
                                                                value: selectedRuleLedger.summary.maxStreak
                                                            })
                                                        ]
                                                    }),
                                                    selectedRuleLedger && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-5 flex min-w-0 flex-wrap gap-2",
                                                        children: [
                                                            selectedRuleValidation && /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                tone: selectedRuleValidation.tone,
                                                                children: selectedRuleValidation.label
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                tone: selectedRule && canRuleParticipateInReference(selectedRule, selectedRuleValidation) ? "green" : "yellow",
                                                                children: selectedRule && canRuleParticipateInReference(selectedRule, selectedRuleValidation) ? "参与综合参考" : "不参与综合参考"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                className: "max-w-full whitespace-normal py-1 leading-4",
                                                                tone: selectedRuleLedger.summary.failedIssues.length ? "rose" : "green",
                                                                children: [
                                                                    "错期：",
                                                                    selectedRuleLedger.summary.failedIssues.join("、") || "暂无"
                                                                ]
                                                            }),
                                                            selectedRuleValidation && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: "min-w-0 text-sm leading-6 text-slate-400",
                                                                children: selectedRuleValidation.reason
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                onClick: ()=>void store.toggleRule(selectedRuleLedger.summary.ruleId),
                                                                children: selectedRuleLedger.summary.enabled ? "停用公式" : "启用公式"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                disabled: !selectedRuleLedger.summary.enabled || selectedRuleValidation?.status === "failed" || selectedRuleValidation?.status === "disabled",
                                                                onClick: ()=>void store.confirmRule(selectedRuleLedger.summary.ruleId),
                                                                children: "标记用户确认"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                variant: "danger",
                                                                onClick: ()=>void store.deleteRule(selectedRuleLedger.summary.ruleId),
                                                                children: "删除公式"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-4 sm:p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                        className: "font-semibold text-white",
                                                        children: "逐期计算流水账"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mt-4 space-y-3 pr-2",
                                                        children: selectedRuleLedger?.entries.slice(-ledgerVisibleCount).reverse().map((entry)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaLedgerRow, {
                                                                entry: entry
                                                            }, entry.currentIssue))
                                                    }),
                                                    selectedRuleLedger && selectedRuleLedger.entries.length > ledgerVisibleCount && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mt-4 flex justify-center",
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                            onClick: ()=>setLedgerVisibleState({
                                                                    ruleId: selectedRuleId,
                                                                    count: ledgerVisibleCount + 20
                                                                }),
                                                            children: "加载更早 20 期"
                                                        })
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(OperationLogPanel, {
                                                logs: operationLogs
                                            })
                                        ]
                                    }),
                                    activeView === "formula-discovery" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-start justify-between gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "公式筛选"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 max-w-4xl text-sm leading-6 text-slate-500",
                                                                        children: "系统会根据基础变量自动组合公式，前 70% 开奖数据用于发现候选，后 30% 开奖数据用于验证稳定性。自动推荐公式只是历史数据筛选结果，不代表未来一定有效；用户确认加入公式库后才会参与综合参考。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex flex-wrap items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                        size: "sm",
                                                                        variant: discoveryDepth === "balanced" ? "primary" : "secondary",
                                                                        onClick: ()=>setDiscoveryDepth("balanced"),
                                                                        children: "稳健组合 \xb7 2-3项"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                        size: "sm",
                                                                        variant: discoveryDepth === "deep" ? "primary" : "secondary",
                                                                        onClick: ()=>setDiscoveryDepth("deep"),
                                                                        children: "智能深度 \xb7 2-4项"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                        tone: "cyan",
                                                                        children: discoveryLoading ? "后台筛选中" : `已生成 ${discoveryCandidates.length} 条候选`
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    discoveryStatus && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: cn("mt-4 rounded-lg border p-3 text-sm", discoveryStatus.includes("失败") ? "border-rose-300/25 bg-rose-300/10 text-rose-100" : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"),
                                                        children: [
                                                            discoveryStatus,
                                                            !discoveryStatus.includes("失败") && /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                                href: "/rules",
                                                                className: "ml-3 text-cyan-100 underline-offset-4 hover:underline",
                                                                children: "去公式管理查看"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_460px]",
                                                children: [
                                                    isFormulaDiscoveryPreparing || discoveryLoading ? /*#__PURE__*/ (0,jsx_runtime.jsx)(ComputationPendingPanel, {
                                                        title: "正在准备公式筛选",
                                                        desc: "先完成页面响应，再运行训练期/验证期筛选，避免打开页面时卡住。"
                                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                                        children: discoveryCandidates.map((candidate)=>{
                                                            const active = focusedDiscoveryCandidate?.rule.id === candidate.rule.id;
                                                            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                                                onClick: ()=>setDiscoveryFocusId(candidate.rule.id),
                                                                className: cn("rounded-lg border p-4 text-left transition hover:bg-white/[0.055]", active ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/[0.08] bg-white/[0.03]"),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex items-start justify-between gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                        className: "font-medium text-white",
                                                                                        children: candidate.rule.formula
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                        className: "mt-1 text-xs text-slate-500",
                                                                                        children: [
                                                                                            categoryLabel(candidate.rule.category),
                                                                                            " \xb7 简洁度 ",
                                                                                            candidate.rule.formula.split("+").length,
                                                                                            " 项"
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                tone: candidate.validationRate >= candidate.trainingRate - 10 ? "green" : "yellow",
                                                                                children: [
                                                                                    candidate.validationRate,
                                                                                    "%"
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-3 xl:grid-cols-5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                children: [
                                                                                    "训练 ",
                                                                                    candidate.trainingRate,
                                                                                    "%"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                children: [
                                                                                    "验证 ",
                                                                                    candidate.validationRate,
                                                                                    "%"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                children: [
                                                                                    "近10 ",
                                                                                    candidate.last10.filter(Boolean).length,
                                                                                    "/",
                                                                                    candidate.last10.length || 0
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                children: [
                                                                                    "错 ",
                                                                                    candidate.failed
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "mt-3 text-xs text-rose-200",
                                                                        children: [
                                                                            "错期：",
                                                                            candidate.failedIssues.slice(0, 6).join("、") || "暂无"
                                                                        ]
                                                                    })
                                                                ]
                                                            }, candidate.rule.id);
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(DiscoveryDetailPanel, {
                                                        candidate: focusedDiscoveryCandidate,
                                                        categoryLabel: focusedDiscoveryCandidate ? categoryLabel(focusedDiscoveryCandidate.rule.category) : "",
                                                        onAdd: (candidate)=>void addDiscoveredRule(candidate.rule),
                                                        existingRule: focusedDiscoveryExistingRule,
                                                        draws: activeDraws,
                                                        config: config
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    activeView === "special-analysis" && /*#__PURE__*/ (0,jsx_runtime.jsx)(SpecialAnalysisView, {
                                        draws: activeDraws,
                                        config: config,
                                        dataSourceLabel: dataSourceLabel,
                                        sourceLoading: sourceLoading,
                                        onSync: ()=>void fetchSourceDraws(true, "replace")
                                    }),
                                    activeView === "draws" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                        className: "p-4 sm:p-5",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                className: "font-semibold text-white",
                                                                children: "历史开奖数据"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                className: "text-xs text-slate-500",
                                                                children: "系统自动生成 L序、D序、特码属性、总数和期号属性"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                className: "w-full sm:w-auto",
                                                                variant: "primary",
                                                                disabled: sourceLoading,
                                                                onClick: ()=>void fetchSourceDraws(true, "replace"),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    sourceLoading ? "同步中" : "同步并写入本地库"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                className: "w-full sm:w-auto",
                                                                onClick: ()=>exportDrawsCsv(activeDraws),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    "导出 CSV"
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-400",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                        tone: hasSharedDraws ? "green" : "slate",
                                                        children: dataSourceLabel
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                        children: [
                                                            "最新期：",
                                                            latestDraw?.issue ?? "-"
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                        children: [
                                                            "计算使用：网站 ",
                                                            websiteDraws.length || Math.max(0, activeDraws.length - manualLocalDraws.length),
                                                            " 条 + 人工 ",
                                                            manualLocalDraws.length,
                                                            " 条 = ",
                                                            activeDraws.length,
                                                            " 条"
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                        children: [
                                                            "最后同步：",
                                                            displayLastSyncAt || "未同步"
                                                        ]
                                                    }),
                                                    sourceStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        children: sourceStatus
                                                    })
                                                ]
                                            }),
                                            manualLocalDraws.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "mb-4 rounded-md border border-cyan-300/20 bg-cyan-300/[0.055] p-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-wrap items-start justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                        className: "text-sm font-semibold text-cyan-50",
                                                                        children: "人工录入开奖"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 text-xs leading-5 text-slate-400",
                                                                        children: "这些记录保存在本机开奖库，并已合并进当前计算数据。期号相同会覆盖旧记录；要保留多条请填写不同期号。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                tone: "cyan",
                                                                children: [
                                                                    manualLocalDraws.length,
                                                                    " 条"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mt-3 grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 lg:grid-cols-2",
                                                        children: [
                                                            ...manualLocalDraws
                                                        ].reverse().map((draw)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "rounded-md border border-white/[0.075] bg-black/20 p-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex flex-wrap items-center justify-between gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                className: "font-mono text-sm font-semibold text-white",
                                                                                children: [
                                                                                    draw.issue,
                                                                                    "期"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: "cyan",
                                                                                        children: "人工录入"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                        size: "sm",
                                                                                        variant: "danger",
                                                                                        onClick: ()=>void deleteManualDraw(draw.issue),
                                                                                        children: "删除"
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-3 flex flex-wrap items-center gap-2",
                                                                        children: [
                                                                            [
                                                                                draw.n1,
                                                                                draw.n2,
                                                                                draw.n3,
                                                                                draw.n4,
                                                                                draw.n5,
                                                                                draw.n6
                                                                            ].map((number, index)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(NumberTile, {
                                                                                    number: number,
                                                                                    config: config
                                                                                }, `${draw.issue}-${index}-${number}`)),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "px-1 font-mono text-lg text-cyan-100",
                                                                                children: "+"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(NumberTile, {
                                                                                number: draw.special,
                                                                                special: true,
                                                                                config: config
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "mt-2 text-xs text-slate-500",
                                                                        children: [
                                                                            "保存时间：",
                                                                            String(draw.rawAttributes?.savedAt ?? "-")
                                                                        ]
                                                                    })
                                                                ]
                                                            }, draw.issue))
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(DataTable, {
                                                data: [
                                                    ...normalizedDraws
                                                ].reverse(),
                                                columns: drawColumns,
                                                dense: true
                                            })
                                        ]
                                    }),
                                    activeView === "import" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-1 gap-4 xl:grid-cols-[1fr_420px]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-4 sm:p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "font-semibold text-white",
                                                        children: "导入开奖数据"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mb-4 text-sm text-slate-500",
                                                        children: "支持网址实时抓取、CSV、Excel、TXT、HTML、粘贴表格。字段可使用 issue/date/n1-n6/special 或中文字段。"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                className: "font-medium text-cyan-100",
                                                                children: "网址实时抓取"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_96px_96px]",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                        value: sourceUrl,
                                                                        onChange: (event)=>setSourceUrl(event.target.value)
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                        type: "number",
                                                                        value: sourceFromYear,
                                                                        onChange: (event)=>setSourceFromYear(event.target.value)
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                        type: "number",
                                                                        value: sourceToYear,
                                                                        onChange: (event)=>setSourceToYear(event.target.value)
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mt-3 flex flex-wrap gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        variant: "primary",
                                                                        disabled: sourceLoading,
                                                                        onClick: ()=>void fetchSourceDraws(true, "replace"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            sourceLoading ? "同步中" : "同步并写入本地库"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        disabled: !sourceRecords.length,
                                                                        onClick: ()=>void replaceLocalDrawsWithSourceRecords(),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            "替换本地库"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            sourceStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                className: "mt-3 text-sm text-slate-300",
                                                                children: sourceStatus
                                                            }),
                                                            sourceSummaries.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "mt-3 grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-3",
                                                                children: sourceSummaries.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "rounded-md border border-white/[0.06] bg-black/20 p-2",
                                                                        children: [
                                                                            item.year,
                                                                            " \xb7 ",
                                                                            item.count,
                                                                            " 条",
                                                                            item.error ? ` · ${item.error}` : ""
                                                                        ]
                                                                    }, `${item.year}-${item.url}`))
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                        className: "mb-2 font-medium text-white",
                                                        children: "文本 / 文件导入"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Textarea, {
                                                        value: importText,
                                                        onChange: (event)=>setImportText(event.target.value),
                                                        className: "min-h-64 font-mono"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 flex flex-wrap gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                variant: "primary",
                                                                onClick: handleParseImport,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(list_checks/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    "解析预览"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                disabled: !previewDraws.length,
                                                                onClick: handleImportPreview,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    "写入本地库"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                                                className: "inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 text-sm text-slate-100 hover:bg-white/[0.09]",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(upload/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    "选择文件",
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                                        className: "hidden",
                                                                        type: "file",
                                                                        accept: ".csv,.txt,.xlsx,.xls,.html,.htm",
                                                                        onChange: (event)=>void handleFile(event.target.files?.[0])
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                        className: "font-semibold text-white",
                                                        children: "导入预检"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mt-1 text-sm text-slate-500",
                                                        children: "重复期号、号码范围、七码完整性会在这里提示。"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                tone: importErrors.length ? "rose" : "green",
                                                                children: importErrors.length ? `${importErrors.length} 个问题` : "可导入"
                                                            }),
                                                            importErrors.map((error)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                    className: "text-sm text-rose-200",
                                                                    children: error
                                                                }, error)),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                className: "text-sm text-slate-300",
                                                                children: [
                                                                    "预览记录：",
                                                                    previewDraws.length
                                                                ]
                                                            }),
                                                            previewDraws.slice(0, 5).map((draw)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                    className: "rounded-md border border-white/[0.06] bg-white/[0.03] p-3 text-xs text-slate-300",
                                                                    children: [
                                                                        draw.issue,
                                                                        " \xb7 ",
                                                                        [
                                                                            draw.n1,
                                                                            draw.n2,
                                                                            draw.n3,
                                                                            draw.n4,
                                                                            draw.n5,
                                                                            draw.n6,
                                                                            draw.special
                                                                        ].join(" ")
                                                                    ]
                                                                }, draw.issue))
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    activeView === "rules" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "公式管理"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: "查看公式状态、最近表现和逐期明细；样例不一致会提示核对，计算报错、变量不确定或停用公式不参与综合参考。"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-3 flex flex-wrap gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                tone: "slate",
                                                                                children: [
                                                                                    "全部 ",
                                                                                    rules.length
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                tone: "cyan",
                                                                                children: [
                                                                                    "人工新增 ",
                                                                                    manualRuleCount
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                tone: "violet",
                                                                                children: [
                                                                                    "系统推荐 ",
                                                                                    systemRecommendedRuleCount
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                tone: "green",
                                                                                children: [
                                                                                    "参与参考 ",
                                                                                    referenceRuleCount
                                                                                ]
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "grid w-full grid-cols-3 gap-2 sm:flex sm:flex-wrap xl:w-auto xl:justify-end",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                                                                        href: "/formula-editor?mode=new",
                                                                        className: "inline-flex h-9 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-cyan-200/35 bg-cyan-300/16 px-3 text-[13px] font-medium text-cyan-50 hover:bg-cyan-300/24 sm:h-10 sm:min-w-[116px] sm:px-4 sm:text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(plus/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            "新增规则"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                        onClick: ()=>selectedRule && void store.duplicateRule(selectedRule.id),
                                                                        children: "复制公式"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                                        href: "/one-click",
                                                                        className: "inline-flex h-9 min-w-0 items-center justify-center whitespace-nowrap rounded-md border border-white/10 bg-white/[0.055] px-3 text-[13px] text-white hover:bg-white/[0.09] sm:h-10 sm:min-w-[104px] sm:px-4 sm:text-sm",
                                                                        children: "试算公式"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-4 grid grid-cols-1 gap-2 md:grid-cols-3",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                                value: ruleFilter,
                                                                onChange: (event)=>setRuleFilter(event.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "all",
                                                                        children: "全部类型"
                                                                    }),
                                                                    categories.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                            value: item.value,
                                                                            children: item.label
                                                                        }, item.value))
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                                value: ruleLibraryFilter,
                                                                onChange: (event)=>{
                                                                    const nextFilter = event.target.value;
                                                                    setRuleLibraryFilter(nextFilter);
                                                                    if ([
                                                                        "user_provided",
                                                                        "system_recommended",
                                                                        "manual",
                                                                        "txt_import",
                                                                        "copied"
                                                                    ].includes(nextFilter)) setRuleFilter("all");
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "all",
                                                                        children: "筛选：全部公式"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "user_provided",
                                                                        children: "筛选：用户提供"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "system_recommended",
                                                                        children: "筛选：系统推荐"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "manual",
                                                                        children: "筛选：人工新增"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "txt_import",
                                                                        children: "筛选：TXT 导入"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "copied",
                                                                        children: "筛选：复制公式"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "enabled",
                                                                        children: "筛选：已启用"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "disabled",
                                                                        children: "筛选：已停用"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "calculable",
                                                                        children: "筛选：可计算"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "error",
                                                                        children: "筛选：计算异常"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                                value: ruleSort,
                                                                onChange: (event)=>setRuleSort(event.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "smart",
                                                                        children: "排序：智能学习排行"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "success_desc",
                                                                        children: "排序：成功率从高到低"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "recent_desc",
                                                                        children: "排序：最近10期从好到差"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "wrong_asc",
                                                                        children: "排序：连错少的在前"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "failed_asc",
                                                                        children: "排序：错期少的在前"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "streak_desc",
                                                                        children: "排序：当前连对从高到低"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "name_asc",
                                                                        children: "排序：公式名称"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mb-4 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.055] p-3 text-xs leading-5 text-cyan-50/85",
                                                        children: "智能学习排行会根据历史成功率、最近10期表现、当前连对、连错和错期自动调权；只是帮助排序和降权，所有结果仍然来自公式计算证据。"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "rq-heavy-list grid grid-cols-1 gap-3 xl:grid-cols-2",
                                                        children: visibleRules.map((rule)=>{
                                                            const result = ruleResultMap.get(rule.id);
                                                            const summary = ruleValidationById.get(rule.id);
                                                            const joinsReference = canRuleParticipateInReference(rule, summary);
                                                            const canConfirm = rule.enabled && summary?.status !== "failed" && summary?.status !== "disabled";
                                                            const smartScore = ruleSmartScore(rule, result);
                                                            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: cn("rounded-lg border p-3 transition hover:bg-white/[0.045] sm:p-4", selectedRuleId === rule.id ? "border-cyan-300/28 bg-cyan-300/[0.075]" : "border-white/[0.065] bg-white/[0.025]"),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "min-w-0 flex-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                        className: "line-clamp-2 break-words text-[15px] font-medium leading-5 text-white sm:text-base",
                                                                                        children: rule.name
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                        className: "mt-1 text-xs text-slate-500",
                                                                                        children: [
                                                                                            categoryLabel(rule.category),
                                                                                            " \xb7 ",
                                                                                            rule.orderMode,
                                                                                            "序"
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex min-w-0 flex-wrap gap-1.5 sm:shrink-0 sm:justify-end",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: sourceTypeTone(rule.sourceType),
                                                                                        children: sourceTypeLabel(rule.sourceType)
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: result?.error || !result?.total ? "rose" : "green",
                                                                                        children: result?.error || !result?.total ? "计算异常" : "可计算"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                                        tone: "cyan",
                                                                                        children: [
                                                                                            "排行分 ",
                                                                                            smartScore > -9999 ? smartScore : "-"
                                                                                        ]
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: summary?.tone ?? (rule.enabled ? "green" : "slate"),
                                                                                        children: summary?.label ?? (rule.enabled ? "已启用" : "已停用")
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: joinsReference ? "green" : "yellow",
                                                                                        children: joinsReference ? "参与综合参考" : "不参与综合参考"
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-3 break-words font-mono text-xs leading-5 text-cyan-100",
                                                                        children: rule.formula
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                className: "rounded-md border border-white/[0.055] bg-black/15 px-2 py-1",
                                                                                children: [
                                                                                    "成功率 ",
                                                                                    result?.successRate ?? 0,
                                                                                    "%"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                className: "rounded-md border border-white/[0.055] bg-black/15 px-2 py-1",
                                                                                children: [
                                                                                    "连对 ",
                                                                                    result?.currentStreak ?? 0
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                className: "rounded-md border border-white/[0.055] bg-black/15 px-2 py-1",
                                                                                children: [
                                                                                    "连错 ",
                                                                                    consecutiveWrong(result)
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                className: "rounded-md border border-white/[0.055] bg-black/15 px-2 py-1",
                                                                                children: [
                                                                                    "最大 ",
                                                                                    result?.maxStreak ?? 0
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                                className: "rounded-md border border-white/[0.055] bg-black/15 px-2 py-1",
                                                                                children: [
                                                                                    "近10 ",
                                                                                    recentSuccessCount(result),
                                                                                    "/",
                                                                                    result?.last10.length ?? 0
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    summary?.reason && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: cn("mt-3 text-xs", summary.status === "mismatch" || summary.status === "failed" ? "text-rose-200" : "text-slate-500"),
                                                                        children: summary.reason
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-4 flex flex-wrap items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                                                href: "/formula-detail",
                                                                                onClick: ()=>store.setSelectedRule(rule.id),
                                                                                className: "inline-flex h-8 items-center justify-center rounded-md border border-cyan-300/24 bg-cyan-300/[0.08] px-3 text-xs text-cyan-50 hover:bg-cyan-300/[0.14]",
                                                                                children: "查看明细"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                                                                href: `/formula-editor?ruleId=${encodeURIComponent(rule.id)}`,
                                                                                onClick: ()=>store.setSelectedRule(rule.id),
                                                                                className: "inline-flex h-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs text-slate-100 hover:bg-white/[0.09]",
                                                                                children: "编辑"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                                                                className: "relative",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                                                        className: "inline-flex h-8 cursor-pointer list-none items-center justify-center rounded-md border border-white/10 bg-white/[0.045] px-3 text-xs text-slate-200 hover:bg-white/[0.08]",
                                                                                        children: "更多"
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                        className: "mt-2 grid min-w-40 gap-2 rounded-md border border-white/[0.08] bg-[#10131b] p-2 shadow-xl sm:absolute sm:right-0 sm:z-20",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                onClick: ()=>store.setSelectedRule(rule.id),
                                                                                                children: "选中"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                disabled: !canConfirm,
                                                                                                onClick: ()=>void store.confirmRule(rule.id),
                                                                                                children: "标记确认"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                onClick: ()=>void store.toggleReferenceParticipation(rule.id),
                                                                                                children: rule.participatesInReference === false ? "参与参考" : "退出参考"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                onClick: ()=>{
                                                                                                    if (rule.enabled && !window.confirm(`确认停用「${rule.name}」吗？停用后不会参与综合参考。`)) return;
                                                                                                    void store.toggleRule(rule.id);
                                                                                                },
                                                                                                children: rule.enabled ? "禁用" : "启用"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                onClick: ()=>void store.duplicateRule(rule.id),
                                                                                                children: "复制"
                                                                                            }),
                                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                                size: "sm",
                                                                                                variant: "danger",
                                                                                                onClick: ()=>{
                                                                                                    if (!window.confirm(`确认删除「${rule.name}」吗？删除后需要从备份恢复。`)) return;
                                                                                                    void store.deleteRule(rule.id);
                                                                                                },
                                                                                                children: "删除"
                                                                                            })
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }, rule.id);
                                                        })
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                                className: "rounded-lg border border-white/[0.075] bg-white/[0.025] p-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                        className: "cursor-pointer text-sm font-medium text-slate-200",
                                                        children: "诊断、备份与规则对账"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaLibraryBackupPanel, {
                                                                        rules: rules,
                                                                        backups: ruleBackups,
                                                                        status: ruleLibraryStatus,
                                                                        onImport: (file)=>void handleRuleLibraryFile(file),
                                                                        onReset: ()=>void store.resetRules(),
                                                                        onRestore: ()=>void store.restoreLastRuleBackup()
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaExceptionPanel, {
                                                                        items: exceptionRules,
                                                                        calculableCount: calculableRuleCount
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaHealthPanel, {
                                                                rows: ruleHealthRows,
                                                                onToggleReserve: (ruleId)=>void store.toggleReferenceParticipation(ruleId)
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(RuleReconciliationPanel, {
                                                                rows: ruleReconciliationRows
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    activeView === "formula-editor" && (editorRule ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-1 gap-4 2xl:grid-cols-[360px_1fr_320px]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(RuleForm, {
                                                selectedRule: editorRule,
                                                onSave: saveRuleFromForm,
                                                compact: true,
                                                draw: latestDraw ?? normalizedDraws[0],
                                                config: config,
                                                periodIndex: latestDraw ? latestPeriodIndex : 0
                                            }, editorRule.id),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaWorkbench, {
                                                rule: editorRule,
                                                draw: latestDraw ?? normalizedDraws[0],
                                                config: config,
                                                periodIndex: latestDraw ? latestPeriodIndex : 0
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                        className: "font-semibold text-white",
                                                        children: "编辑旧规则"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mt-2 text-sm leading-6 text-slate-400",
                                                        children: "当前是编辑模式，只会保存修改到这条规则。新增请从公式管理点击“新增规则”。"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-slate-300",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                children: [
                                                                    "试算期：",
                                                                    latestDraw?.issue ?? "-"
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                className: "mt-2 font-mono text-cyan-100",
                                                                children: latestNumbersLabel
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(NewRuleBuilder, {
                                        onSave: saveRuleFromForm,
                                        draw: latestDraw ?? normalizedDraws[0],
                                        config: config,
                                        periodIndex: latestDraw ? latestPeriodIndex : 0
                                    })),
                                    activeView === "backtest" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "回测中心"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: [
                                                                            "当前使用 ",
                                                                            dataSourceLabel,
                                                                            " \xb7 ",
                                                                            activeDraws.length,
                                                                            " 期；默认用第 N 期计算，验证第 N+1 期的特码属性。"
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        variant: "primary",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(play/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            "已实时运行"
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        onClick: ()=>exportBacktestExcel(backtest),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            "导出结果"
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "总验证期数",
                                                                value: selectedRuleResult?.total ?? 0
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "成功期数",
                                                                value: selectedRuleResult?.success ?? 0,
                                                                tone: "green"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "失败期数",
                                                                value: selectedRuleResult?.failed ?? 0,
                                                                tone: "rose"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "成功率",
                                                                value: `${selectedRuleResult?.successRate ?? 0}%`
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "当前连对",
                                                                value: selectedRuleResult?.currentStreak ?? 0,
                                                                tone: "violet"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
                                                className: "p-5",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(DataTable, {
                                                    data: [
                                                        ...selectedRuleResult?.details ?? []
                                                    ].reverse(),
                                                    columns: detailColumns,
                                                    dense: true
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ProcessInspector, {
                                                detail: selectedRuleResult?.details.at(-1)
                                            })
                                        ]
                                    }),
                                    activeView === "candidate-pool" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-4 sm:p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "text-lg font-semibold text-white",
                                                                        children: "综合参考结果"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-1 text-sm leading-6 text-slate-400",
                                                                        children: "先同步最新开奖，再重新生成结果；每个号码都可以继续查看支持和排除依据。"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "grid w-full grid-cols-2 gap-2 xl:flex xl:w-auto xl:flex-wrap xl:justify-end",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        className: "w-full xl:w-auto",
                                                                        disabled: sourceLoading,
                                                                        variant: "primary",
                                                                        onClick: ()=>void fetchSourceDraws(true, "replace"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "sm:hidden",
                                                                                children: sourceLoading ? "同步中" : "同步开奖"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "hidden sm:inline",
                                                                                children: sourceLoading ? "同步中" : "同步配置开奖源"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        className: "w-full xl:w-auto",
                                                                        onClick: handleRegenerateReference,
                                                                        disabled: referenceCalculating,
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(activity/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "sm:hidden",
                                                                                children: referenceCalculating ? "计算中" : "重新生成"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "hidden sm:inline",
                                                                                children: referenceCalculating ? "正在计算公式信号..." : "重新生成综合参考结果"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        className: "col-span-2 w-full xl:w-auto",
                                                                        disabled: !candidateReport.signalCount,
                                                                        onClick: ()=>void saveReferenceReport(candidateReport, "manual", "用户手动保存当前综合推荐"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "sm:hidden",
                                                                                children: "保存推荐"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "hidden sm:inline",
                                                                                children: "保存本次推荐"
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4 text-sm text-slate-400",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                tone: sourceRecordBadgeTone,
                                                                children: sourceRecordBadgeLabel
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                children: sourceStatus || "打开本页会自动同步一次并写入本地库；网站每天更新后，也可以手动重新同步。"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                                                className: "rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                                        className: "cursor-pointer text-sm font-medium text-cyan-100",
                                                                        children: "综合参考结果说明"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-3 space-y-3 text-sm leading-6 text-slate-400",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                children: "本页面的参考生肖和参考号码不是固定历史排名，也不是保证结果。系统先用历史数据检查公式表现，再把最新一期代入所有已启用且可参与的公式，最后合并支持与排除信号生成排序。"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                        className: "text-slate-200",
                                                                                        children: "历史数据："
                                                                                    }),
                                                                                    "判断成功率、错期、最近表现和连对。",
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                        className: "text-slate-200",
                                                                                        children: "最新开奖："
                                                                                    }),
                                                                                    "计算这一期每条公式输出什么。",
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                        className: "text-slate-200",
                                                                                        children: "综合结果："
                                                                                    }),
                                                                                    "合并所有公式的支持和排除。"
                                                                                ]
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "text-amber-100",
                                                                                children: "同步新开奖、启用/停用/删除/修改公式，或修改基础表后，需要重新生成。结果仅用于公式研究和参考排序。"
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                                                className: "rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                                        className: "cursor-pointer text-sm font-medium text-slate-200",
                                                                        children: "开奖源与年份设置"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_110px_110px]",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                "aria-label": "开奖数据来源",
                                                                                value: sourceUrl,
                                                                                onChange: (event)=>setSourceUrl(event.target.value)
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                "aria-label": "开始年份",
                                                                                type: "number",
                                                                                value: sourceFromYear,
                                                                                onChange: (event)=>setSourceFromYear(event.target.value)
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                "aria-label": "结束年份",
                                                                                type: "number",
                                                                                value: sourceToYear,
                                                                                onChange: (event)=>setSourceToYear(event.target.value)
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                        className: "mt-3 w-full sm:w-auto",
                                                                        disabled: !sourceRecords.length,
                                                                        onClick: ()=>void replaceLocalDrawsWithSourceRecords(),
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                                className: "h-4 w-4"
                                                                            }),
                                                                            "用已同步数据替换本地库"
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "rq-card-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(LatestDrawCard, {
                                                        draw: latestRawDraw,
                                                        config: config,
                                                        issue: candidateReport.latestIssue ?? latestRawDraw?.issue,
                                                        source: "平1-6 + 特码，号码下方标注生肖"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "使用最新期号",
                                                        value: candidateReport.latestIssue ?? "-",
                                                        hint: candidateReport.latestDate ?? "-",
                                                        tone: "violet"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "数据来源",
                                                        value: dataSourceLabel,
                                                        hint: sourceRecords.length ? "已同步" : "本地"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "启用公式",
                                                        value: enabledRuleCount,
                                                        hint: `手动排除 ${excludedRuleCount}`,
                                                        tone: "green"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "用户提供公式",
                                                        value: userProvidedRuleCount,
                                                        hint: "默认可参与",
                                                        tone: "green"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "人工新增公式",
                                                        value: manualRuleCount,
                                                        hint: "用户决定",
                                                        tone: "cyan"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "系统推荐公式",
                                                        value: systemRecommendedRuleCount,
                                                        hint: "确认后参与",
                                                        tone: "violet"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "可计算公式",
                                                        value: calculableRuleCount,
                                                        hint: "无变量错误",
                                                        tone: "cyan"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "实际参与公式",
                                                        value: candidateReport.ruleCount,
                                                        hint: "本次计算",
                                                        tone: "green"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "样例已核对",
                                                        value: checkedSampleRuleCount,
                                                        hint: `未核对 ${uncheckedSampleRuleCount}`,
                                                        tone: "yellow"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "本次生成证据",
                                                        value: candidateReport.signalCount,
                                                        hint: "支持/排除"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "结果生成时间",
                                                        value: referenceGeneratedAt || candidateReport.generatedAt ? new Date(referenceGeneratedAt || candidateReport.generatedAt).toLocaleString("zh-CN", {
                                                            hour12: false
                                                        }) : "-",
                                                        hint: "当前页面"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                        label: "是否使用最新同步数据",
                                                        value: isUsingSyncedData ? "是" : "否",
                                                        hint: displayLastSyncAt || "未同步",
                                                        tone: isUsingSyncedData ? "green" : "yellow"
                                                    })
                                                ]
                                            }),
                                            shouldWarnStaleData && /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
                                                className: "border-amber-300/25 bg-amber-300/[0.07] p-4",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                    className: "text-sm text-amber-100",
                                                    children: "当前可能不是最新开奖数据，请先同步。同步新一期开奖后，系统会重新计算综合参考结果。"
                                                })
                                            }),
                                            referenceStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
                                                className: "p-4",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                    className: "text-sm text-emerald-100",
                                                    children: referenceStatus
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(panel_Panel, {
                                                className: "p-4",
                                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                    className: "font-semibold text-white",
                                                                    children: "历史预测复盘保存"
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                    className: "mt-1 text-sm text-slate-500",
                                                                    children: "选择以前某一期，系统会按那一期及以前的数据重新生成当时的综合推荐，并自动和后续开奖对比命中情况。"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                            className: "grid gap-2 sm:grid-cols-[180px_auto]",
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                                    value: selectedReferenceArchiveIssue,
                                                                    onChange: (event)=>setReferenceArchiveIssue(event.target.value),
                                                                    children: activeDraws.map((draw)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("option", {
                                                                            value: draw.issue,
                                                                            children: [
                                                                                draw.issue,
                                                                                "期"
                                                                            ]
                                                                        }, draw.issue))
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                    disabled: referenceArchiveSaving || !isCandidatePoolReady || !selectedReferenceArchiveIssue,
                                                                    onClick: ()=>saveReferenceArchiveForIssue(selectedReferenceArchiveIssue),
                                                                    children: [
                                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                                            className: "h-4 w-4"
                                                                        }),
                                                                        referenceArchiveSaving ? "正在保存复盘..." : "保存这期历史复盘"
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            }),
                                            isCandidatePoolPreparing && /*#__PURE__*/ (0,jsx_runtime.jsx)(ComputationPendingPanel, {
                                                title: "正在准备综合参考结果",
                                                desc: "页面已经响应，正在延后计算公式信号、候选排序和证据链，避免切换页面卡住。"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceObservationPanel, {
                                                report: referenceObservation
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryPanel, {
                                                records: resolvedReferenceHistory,
                                                config: config,
                                                onDelete: (recordId)=>void store.deleteReferenceHistory(recordId),
                                                onClear: ()=>void store.clearReferenceHistory(),
                                                onExportJson: ()=>exportJson(resolvedReferenceHistory, "rulequant-reference-history.json"),
                                                onExportExcel: ()=>exportReferenceHistoryExcel(resolvedReferenceHistory),
                                                onExportWord: ()=>exportReferenceHistoryWord(resolvedReferenceHistory),
                                                onExportText: ()=>exportReferenceHistoryText(resolvedReferenceHistory)
                                            }),
                                            exceptionRules.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaExceptionPanel, {
                                                items: exceptionRules,
                                                calculableCount: calculableRuleCount
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaHealthPanel, {
                                                rows: ruleHealthRows,
                                                onToggleReserve: (ruleId)=>void store.toggleReferenceParticipation(ruleId),
                                                compact: true
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ManualCombinationPanel, {
                                                rules: rules,
                                                selectedRuleIds: selectedComboRuleIds,
                                                setSelectedRuleIds: setSelectedComboRuleIds,
                                                report: manualComboReport,
                                                validationById: ruleValidationById
                                            }),
                                            isCandidatePoolPreparing ? null : candidateReport.ruleCount === 0 || candidateReport.signalCount === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceEmptyState, {}) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_420px]",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                        className: "p-5",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                className: "font-semibold text-white",
                                                                                children: "综合参考结果"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                                className: "text-xs text-slate-500",
                                                                                children: "本结果由历史公式表现和最新一期公式计算结果综合生成，仅供参考。"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                        className: "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end",
                                                                        children: [
                                                                            [
                                                                                "numbers8",
                                                                                "重点号码 Top 8"
                                                                            ],
                                                                            [
                                                                                "numbers12",
                                                                                "次选号码 Top 12"
                                                                            ],
                                                                            [
                                                                                "numbers18",
                                                                                "宽参考 Top 18"
                                                                            ],
                                                                            [
                                                                                "numbers16",
                                                                                "号码 Top 16"
                                                                            ],
                                                                            [
                                                                                "zodiacs9",
                                                                                "生肖 Top 9"
                                                                            ],
                                                                            [
                                                                                "zodiacs8",
                                                                                "生肖 Top 8"
                                                                            ],
                                                                            [
                                                                                "zodiacs7",
                                                                                "生肖 Top 7"
                                                                            ]
                                                                        ].map(([key, label])=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                                                size: "sm",
                                                                                variant: candidateTab === key ? "primary" : "secondary",
                                                                                onClick: ()=>setCandidateTab(key),
                                                                                children: label
                                                                            }, key))
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "mb-4 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.055] p-3 text-xs leading-5 text-cyan-50/85",
                                                                children: "先看重点 Top 8；它会优先选择直接支持更强、反对更少、净证据更好的号码。Top 18 只作为宽参考，不建议当作主选择范围。"
                                                            }),
                                                            candidateTab === "numbers8" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateNumberList, {
                                                                items: candidateReport.topNumbers8,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus,
                                                                compact: true
                                                            }),
                                                            candidateTab === "numbers12" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateNumberList, {
                                                                items: candidateReport.topNumbers12,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus,
                                                                compact: true
                                                            }),
                                                            candidateTab === "numbers18" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateNumberList, {
                                                                items: candidateReport.topNumbers18,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus
                                                            }),
                                                            candidateTab === "numbers16" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateNumberList, {
                                                                items: candidateReport.topNumbers16,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus
                                                            }),
                                                            candidateTab === "zodiacs9" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateZodiacList, {
                                                                items: candidateReport.topZodiacs9,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus
                                                            }),
                                                            candidateTab === "zodiacs8" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateZodiacList, {
                                                                items: candidateReport.topZodiacs8,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus
                                                            }),
                                                            candidateTab === "zodiacs7" && /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateZodiacList, {
                                                                items: candidateReport.topZodiacs7,
                                                                focus: candidateFocus,
                                                                onFocus: setCandidateFocus
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(CandidateEvidencePanel, {
                                                        candidate: focusedCandidate
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mb-4 flex items-center justify-between",
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                    className: "font-semibold text-white",
                                                                    children: "公式依据明细"
                                                                }),
                                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                    className: "text-xs text-slate-500",
                                                                    children: "每条启用公式会给某些号码加分或扣分，作为参考排序依据。"
                                                                })
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "mb-4 rounded-md border border-cyan-300/18 bg-cyan-300/[0.055] p-3 text-sm leading-6 text-cyan-50/85",
                                                        children: candidateReport.riskNotice
                                                    }),
                                                    candidateReport.signals.length === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-500",
                                                        children: "暂无公式依据。请检查公式是否已启用、可计算且未被手动排除。"
                                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                                        children: candidateReport.signals.map((signal, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h4", {
                                                                                className: "min-w-0 break-words font-medium text-white sm:truncate",
                                                                                children: signal.ruleName
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                                className: "flex min-w-0 flex-wrap gap-2 sm:shrink-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: sourceTypeTone(signal.sourceType),
                                                                                        children: sourceTypeLabel(signal.sourceType)
                                                                                    }),
                                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                        tone: signal.action === "include" ? "green" : "rose",
                                                                                        children: signal.action === "include" ? "支持" : "排除"
                                                                                    })
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "mt-2 font-mono text-xs text-cyan-100",
                                                                        children: signal.formula
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                        className: "mt-2 text-sm text-slate-400",
                                                                        children: [
                                                                            "对象：",
                                                                            signal.targets.join("、"),
                                                                            " \xb7 权重 ",
                                                                            signal.weight,
                                                                            " \xb7 历史 ",
                                                                            signal.successRate,
                                                                            "% \xb7 近10期 ",
                                                                            signal.recentRate,
                                                                            "%"
                                                                        ]
                                                                    })
                                                                ]
                                                            }, `${signal.ruleId}-${signal.action}-${index}`))
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(OperationLogPanel, {
                                                logs: operationLogs
                                            })
                                        ]
                                    }),
                                    activeView === "sample-check" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-1 gap-4 xl:grid-cols-[420px_1fr]",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                        className: "font-semibold text-white",
                                                        children: "公式校验"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mt-1 text-sm leading-6 text-slate-500",
                                                        children: "录入 TXT 手算样例后，系统会逐项检查变量取值、原始结果、归一化、映射结果和下期判断。不一致会标红，不能静默通过。"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mt-4 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                children: "规则"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                                value: sampleDraft.ruleId,
                                                                onChange: (event)=>setSampleDraft({
                                                                        ...sampleDraft,
                                                                        ruleId: event.target.value
                                                                    }),
                                                                children: rules.map((rule)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: rule.id,
                                                                        children: rule.name
                                                                    }, rule.id))
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                children: "期号"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                value: sampleDraft.issue,
                                                                onChange: (event)=>setSampleDraft({
                                                                        ...sampleDraft,
                                                                        issue: event.target.value
                                                                    })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                                children: "手算 raw"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                value: sampleDraft.expectedRawResult,
                                                                                onChange: (event)=>setSampleDraft({
                                                                                        ...sampleDraft,
                                                                                        expectedRawResult: event.target.value
                                                                                    })
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                                children: "手算归一"
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                                value: sampleDraft.expectedFinalResult,
                                                                                onChange: (event)=>setSampleDraft({
                                                                                        ...sampleDraft,
                                                                                        expectedFinalResult: event.target.value
                                                                                    })
                                                                            })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                children: "手算映射结果"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                                value: sampleDraft.expectedMappedResult,
                                                                onChange: (event)=>setSampleDraft({
                                                                        ...sampleDraft,
                                                                        expectedMappedResult: event.target.value
                                                                    }),
                                                                placeholder: "鼠 或 6,7,8,9,0,1,3"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                                children: "手算验证结果"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                                value: sampleDraft.expectedSuccess,
                                                                onChange: (event)=>setSampleDraft({
                                                                        ...sampleDraft,
                                                                        expectedSuccess: event.target.value
                                                                    }),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "true",
                                                                        children: "通过"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                                        value: "false",
                                                                        children: "失败"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                                variant: "primary",
                                                                onClick: saveSample,
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(plus/* default */.A, {
                                                                        className: "h-4 w-4"
                                                                    }),
                                                                    "加入样例"
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-4 flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                        className: "font-semibold text-white",
                                                                        children: "校验结果"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        className: "text-xs text-slate-500",
                                                                        children: "不一致时按公式结果、归一化、映射、验证结果标出差异来源"
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                                tone: sampleResults.some((result)=>!result.passed) ? "rose" : "green",
                                                                children: [
                                                                    sampleResults.length,
                                                                    " 条样例"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "已核对",
                                                                value: passedRuleCount,
                                                                tone: "green"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "未做样例核对",
                                                                value: pendingRuleCount,
                                                                tone: "yellow"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(rulequant_terminal_Metric, {
                                                                label: "不一致",
                                                                value: ruleValidationSummaries.filter((summary)=>summary.status === "mismatch").length,
                                                                tone: "rose"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "space-y-3",
                                                        children: sampleResults.map((result)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: cn("rounded-lg border p-4", result.passed ? "border-emerald-300/20 bg-emerald-300/5" : "border-rose-300/25 bg-rose-300/8"),
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                                className: "font-mono text-sm text-white",
                                                                                children: result.caseId
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                                tone: result.passed ? "green" : "rose",
                                                                                children: result.passed ? "通过" : "不一致"
                                                                            })
                                                                        ]
                                                                    }),
                                                                    result.differences.map((diff)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                            className: "mt-2 text-sm text-rose-100",
                                                                            children: [
                                                                                diff.type,
                                                                                ": 期望 ",
                                                                                String(diff.expected),
                                                                                "，程序 ",
                                                                                String(diff.actual)
                                                                            ]
                                                                        }, diff.type))
                                                                ]
                                                            }, result.caseId))
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    activeView === "next-output" && /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                        className: "p-5",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "mb-4 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                                                className: "font-semibold text-white",
                                                                children: "下一期规则输出"
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                className: "text-xs text-slate-500",
                                                                children: [
                                                                    "基于最新一期 ",
                                                                    latestDraw?.issue ?? "-",
                                                                    " 生成所有启用规则的规则输出，仅为历史规则研究输出，不作为任何资金决策依据。"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                                        onClick: ()=>exportWorkbook({
                                                                next_output: nextOutputs.map((item)=>({
                                                                        rule: item.rule.name,
                                                                        result: hasCalculation(item) ? item.calculation.mappedResult.join("、") : item.error
                                                                    }))
                                                            }, "rulequant-next-output.xlsx"),
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                                                className: "h-4 w-4"
                                                            }),
                                                            "导出 Excel"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                                children: nextOutputs.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                        className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "flex items-center justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                                                                className: "font-medium text-white",
                                                                                children: item.rule.name
                                                                            }),
                                                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                                                className: "text-xs text-slate-500",
                                                                                children: [
                                                                                    categoryLabel(item.rule.category),
                                                                                    " \xb7 ",
                                                                                    item.rule.formula
                                                                                ]
                                                                            })
                                                                        ]
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                                        tone: "cyan",
                                                                        children: hasCalculation(item) ? item.calculation.mappedResult.join("、") : "异常"
                                                                    })
                                                                ]
                                                            }),
                                                            hasCalculation(item) ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                                className: "mt-3 space-y-1 text-xs text-slate-400",
                                                                children: item.calculation.process.slice(0, 5).map((line)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                        children: line
                                                                    }, line))
                                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                                className: "mt-3 text-sm text-rose-200",
                                                                children: item.error
                                                            })
                                                        ]
                                                    }, item.rule.id))
                                            })
                                        ]
                                    }),
                                    activeView === "config" && /*#__PURE__*/ (0,jsx_runtime.jsx)(ConfigEditor, {
                                        config: config,
                                        updateConfig: store.updateConfig,
                                        resetSeed: store.resetSeed
                                    }, JSON.stringify(config)),
                                    activeView === "reports" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: database/* default */.A,
                                                title: "开奖数据",
                                                desc: "导出 CSV / Excel 格式的当前验证开奖数据",
                                                action: ()=>exportDrawsCsv(activeDraws)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: icons_layers/* default */.A,
                                                title: "规则库 JSON",
                                                desc: "导出当前规则对象，可用于备份或迁移",
                                                action: ()=>exportJson(rules, "rulequant-rules.json")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: settings_2/* default */.A,
                                                title: "配置 JSON",
                                                desc: "导出生肖、波色、五行和归一化配置",
                                                action: ()=>exportJson(config, "rulequant-config.json")
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: chart_column/* default */.A,
                                                title: "回测 Excel",
                                                desc: "导出每期计算过程、输出和验证结果",
                                                action: ()=>exportBacktestExcel(backtest)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: activity/* default */.A,
                                                title: "候选池 Excel",
                                                desc: "导出 Top 号码、Top 生肖和规则信号明细",
                                                action: ()=>exportCandidatePoolExcel(candidateReport)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: file_down/* default */.A,
                                                title: "候选池 HTML",
                                                desc: "生成可直接转发查看的规则共识候选池报告",
                                                action: ()=>exportCandidatePoolHtml(candidateReport)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: table_properties/* default */.A,
                                                title: "综合推荐历史 Excel",
                                                desc: "分工作表导出总览、Top8、Top12、Top18 和生肖明细，便于筛选复盘",
                                                action: ()=>exportReferenceHistoryExcel(resolvedReferenceHistory)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: file_down/* default */.A,
                                                title: "综合推荐历史 Word",
                                                desc: "导出排版好的 Word 兼容文档，包含字体、表格、命中标记和完整推荐记录",
                                                action: ()=>exportReferenceHistoryWord(resolvedReferenceHistory)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: clipboard_check/* default */.A,
                                                title: "综合推荐历史 TXT",
                                                desc: "导出 UTF-8 文本文档，适合直接转发或保存，不会出现中文乱码",
                                                action: ()=>exportReferenceHistoryText(resolvedReferenceHistory)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: clipboard_check/* default */.A,
                                                title: "样例校验",
                                                desc: "导出手算样例对比和差异类型",
                                                action: ()=>exportSampleReport(sampleResults)
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ExportTile, {
                                                icon: file_down/* default */.A,
                                                title: "HTML 报告",
                                                desc: "生成可直接打开的 HTML 回测报告",
                                                action: ()=>exportHtmlReport(backtest, rules, config)
                                            })
                                        ]
                                    }),
                                    activeView === "help" && /*#__PURE__*/ (0,jsx_runtime.jsx)(RuleUnderstandingPage, {})
                                ]
                            }, activeView)
                        ]
                    })
                ]
            })
        ]
    });
}
function OneClickResultCard({ item, categoryLabel, onOpen }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: cn("rounded-lg border p-4", item.error ? "border-rose-300/25 bg-rose-300/8" : "border-white/[0.08] bg-white/[0.03]"),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.1fr_.8fr_1.4fr_1fr_120px]",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h4", {
                                className: "font-medium text-white",
                                children: item.ruleName
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: [
                                    categoryLabel,
                                    " \xb7 ",
                                    item.orderMode,
                                    "序"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "font-mono text-xs text-cyan-100",
                        children: item.formula
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "font-mono text-xs text-slate-300",
                                children: item.equationLine
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: item.variableLine
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-sm text-white",
                                children: item.finalOutputLabel
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: item.mappingLine
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)((link_default()), {
                        href: "/formula-detail",
                        onClick: onOpen,
                        className: "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs text-slate-100 hover:bg-white/[0.09]",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(eye/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "查看明细"
                        ]
                    })
                ]
            }),
            item.error && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-3 text-sm text-rose-200",
                children: item.error
            })
        ]
    });
}
function DiscoveryDetailPanel({ candidate, categoryLabel, onAdd, existingRule, draws, config }) {
    const ledger = (0,react.useMemo)(()=>candidate ? buildFormulaLedger(candidate, {
            draws,
            config
        }) : undefined, [
        candidate,
        draws,
        config
    ]);
    if (!candidate || !ledger) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
            className: "p-5",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                    className: "font-semibold text-white",
                    children: "候选公式详情"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "mt-3 text-sm text-slate-500",
                    children: "暂无候选公式。"
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "候选公式详情"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: [
                                    categoryLabel,
                                    " \xb7 系统推荐公式"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: "yellow",
                        children: "加入前需人工确认"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-4 font-mono text-sm text-cyan-100",
                children: candidate.rule.formula
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.08] bg-white/[0.03] p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "训练期表现"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 font-mono text-[20px] text-white",
                                children: [
                                    candidate.trainingRate,
                                    "%"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: [
                                    candidate.trainingResult.total,
                                    " 期"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.08] bg-white/[0.03] p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "验证期表现"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 font-mono text-[20px] text-white",
                                children: [
                                    candidate.validationRate,
                                    "%"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-1 text-xs text-slate-500",
                                children: [
                                    candidate.validationResult.total,
                                    " 期"
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid grid-cols-1 gap-2 text-xs text-slate-400 sm:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        children: [
                            "总验证 ",
                            candidate.total
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        children: [
                            "近10期 ",
                            candidate.last10.filter(Boolean).length,
                            "/",
                            candidate.last10.length || 0
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                        children: [
                            "当前连对 ",
                            candidate.currentStreak
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "mt-3 text-xs text-rose-200",
                children: [
                    "明确错期：",
                    candidate.failedIssues.slice(0, 12).join("、") || "暂无"
                ]
            }),
            existingRule ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid gap-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        className: "w-full",
                        disabled: true,
                        variant: "secondary",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "已加入公式库"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                        href: "/rules",
                        onClick: ()=>useRuleQuantStore.getState().setSelectedRule(existingRule.id),
                        className: "inline-flex h-10 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 text-sm text-cyan-50 hover:bg-cyan-300/16",
                        children: "去公式管理查看"
                    })
                ]
            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                className: "mt-4 w-full",
                variant: "primary",
                onClick: ()=>onAdd(candidate),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(plus/* default */.A, {
                        className: "h-4 w-4"
                    }),
                    "确认并加入公式库"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-5 max-h-[480px] space-y-3 overflow-auto pr-2",
                children: ledger.entries.slice(-12).reverse().map((entry)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(FormulaLedgerRow, {
                        entry: entry
                    }, `${candidate.rule.id}-${entry.currentIssue}`))
            })
        ]
    });
}
function FormulaLedgerRow({ entry }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: cn("rounded-lg border p-4", entry.isPending ? "border-amber-300/30 bg-amber-300/8" : entry.isFailure ? "border-rose-300/30 bg-rose-300/8" : "border-emerald-300/20 bg-emerald-300/5"),
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "font-mono text-sm text-white",
                                        children: [
                                            entry.currentIssue,
                                            "期"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                        tone: entry.isPending ? "yellow" : entry.isFailure ? "rose" : "green",
                                        children: [
                                            entry.statusText,
                                            " ",
                                            entry.statusIcon
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        className: "text-xs text-slate-500",
                                        children: [
                                            "当前开奖：",
                                            entry.currentNumbersLabel
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-3 font-mono text-sm text-cyan-100",
                                children: entry.equationLine
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                className: "mt-2 text-sm text-slate-300",
                                children: [
                                    entry.mappingLine,
                                    "，本期公式结果：",
                                    entry.finalOutputLabel
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 text-sm text-slate-300",
                                children: entry.nextOpenLabel
                            })
                        ]
                    }),
                    entry.isPending ? /*#__PURE__*/ (0,jsx_runtime.jsx)(activity/* default */.A, {
                        className: "h-6 w-6 shrink-0 text-amber-300"
                    }) : entry.isFailure ? /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_x/* default */.A, {
                        className: "h-6 w-6 shrink-0 text-rose-300"
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(circle_check/* default */.A, {
                        className: "h-6 w-6 shrink-0 text-emerald-300"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                open: true,
                className: "mt-3 rounded-md border border-white/[0.06] bg-black/20 p-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                        className: "cursor-pointer text-sm text-slate-300",
                        children: "展开变量取值和处理过程"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 space-y-2 text-xs text-slate-400",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "公式原文：",
                                    entry.formula
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "变量取值：",
                                    entry.variableLine
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "原始结果：",
                                    entry.rawResult
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "结果处理：",
                                    entry.processingLine || "-"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-300",
                                children: entry.compactLine
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
const builderIntentOptions = [
    {
        value: "include_zodiac",
        label: "选生肖",
        hint: "公式算出一个生肖，作为支持信号"
    },
    {
        value: "kill_zodiac",
        label: "杀生肖",
        hint: "公式算出一个生肖，作为排除信号"
    },
    {
        value: "seven_tail",
        label: "七尾",
        hint: "按定位尾数做 0-9 闭环偏移"
    },
    {
        value: "six_zodiac",
        label: "取六肖",
        hint: "按平码位置循环加减，生成一组生肖候选"
    },
    {
        value: "eight_zodiac",
        label: "八肖起点",
        hint: "从定位生肖扩展成八肖候选"
    },
    {
        value: "nine_zodiac",
        label: "九肖自用",
        hint: "按 +1234567911 这类取值扩展九肖"
    },
    {
        value: "kill_tail",
        label: "杀尾",
        hint: "公式算出一个尾数，作为排除信号"
    },
    {
        value: "kill_sum",
        label: "杀合",
        hint: "公式算出一个合数，作为排除信号"
    }
];
const builderValueOptions = [
    {
        value: "number",
        label: "号码本身"
    },
    {
        value: "head",
        label: "头"
    },
    {
        value: "tail",
        label: "尾"
    },
    {
        value: "sum",
        label: "合"
    },
    {
        value: "sumTail",
        label: "合尾"
    },
    {
        value: "segment",
        label: "段"
    },
    {
        value: "element",
        label: "五行值"
    },
    {
        value: "color",
        label: "波色值"
    },
    {
        value: "parity",
        label: "单双"
    },
    {
        value: "size",
        label: "大小"
    }
];
function positionLabel(position) {
    return position === 7 ? "特码" : `第${position}位`;
}
function positionVariable(position) {
    return position === 7 ? "特码" : `平${position}`;
}
function valueVariable(position, kind) {
    const base = positionVariable(position);
    switch(kind){
        case "head":
            return `${base}头`;
        case "tail":
            return `${base}尾`;
        case "sum":
            return `${base}合`;
        case "sumTail":
            return `${base}合尾`;
        case "segment":
            return `${base}段`;
        case "element":
            return `${base}五行值`;
        case "color":
            return `${base}波色值`;
        case "parity":
            return `${base}单双`;
        case "size":
            return `${base}大小`;
        default:
            return base;
    }
}
function buildFormulaText(position, kind, offset) {
    const base = valueVariable(position, kind);
    if (!offset) return base;
    return `${base} ${offset > 0 ? "+" : "-"} ${Math.abs(offset)}`;
}
function normalizeTailOffsetText(text) {
    const cleaned = text.replace(/[，、\s]+/g, ",").replace(/^\+/, "");
    return cleaned || "-3,-2,-1,0,1,2,4";
}
function parseCompactOffsetText(text) {
    const source = text.trim();
    if (!source) return [];
    if (/^[+]?\d+$/.test(source)) {
        const compact = source.replace(/[^\d]/g, "");
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
        return offsets;
    }
    return [
        ...source.matchAll(/[+-]?\d+/g)
    ].map((match)=>Number(match[0])).filter(Number.isFinite);
}
function formatOffsetList(offsets) {
    return offsets.map((offset)=>String(offset)).join(",");
}
function normalizeZodiacSetOffsetText(text) {
    const offsets = parseCompactOffsetText(text);
    return offsets.length ? formatOffsetList(offsets) : "0,1,2,3,4,8";
}
function normalizerForBuilder(intent, tailMode, customTailOffsets, zodiacOffsets) {
    if (intent === "seven_tail") {
        if (tailMode === "left2right4") return "tail_window:left=2,right=4";
        if (tailMode === "custom") return `tail_offsets:${normalizeTailOffsetText(customTailOffsets)}`;
        return "tail_window:left=3,right=3";
    }
    if (intent === "six_zodiac") return `zodiac_set_offsets:${normalizeZodiacSetOffsetText(zodiacOffsets)}`;
    if (intent === "nine_zodiac") return `zodiac_offsets:${zodiacOffsets || "+1234567911"}`;
    return "auto";
}
function targetForBuilder(intent) {
    if (intent === "kill_tail" || intent === "seven_tail") return "special_tail";
    if (intent === "kill_sum") return "special_sum";
    return "special_zodiac";
}
function builderName(intent, position, valueKind) {
    const intentLabel = builderIntentOptions.find((item)=>item.value === intent)?.label ?? "新增规则";
    const valueLabel = builderValueOptions.find((item)=>item.value === valueKind)?.label ?? "号码本身";
    return `${positionLabel(position)}${valueLabel}${intentLabel}`;
}
function inferRuleText(rawText, currentIssue) {
    const text = rawText.trim();
    const positionPatternText = text.match(/取\s*平\s*([1-7.\s]+)(?:循环)?/u)?.[1] ?? text.match(/平\s*([1-7]+(?:\.[1-7]+)+)/u)?.[1] ?? "";
    const inferredPositionPattern = parsePositionPattern(positionPatternText);
    const zodiacSetOffsets = text.match(/[+＋]\s*([0-9,\s.]+)/u)?.[1];
    const isSixZodiacText = /六肖/.test(text) || /取\s*平\s*[1-7.\s]+/u.test(text);
    const positionMatch = text.match(/(?:平(?:码)?|第)\s*([1-7])|特码|特号|特/);
    const position = inferredPositionPattern[0] ?? (positionMatch?.[1] ? Number(positionMatch[1]) : /特码|特号|特/.test(text) ? 7 : 1);
    const compactOffsets = text.match(/取值\s*([+-]?\d+)/);
    const isZodiacOffsetText = !isSixZodiacText && (/九肖/.test(text) || Boolean(compactOffsets && compactOffsets[1].replace(/\D/g, "").length >= 2));
    const offsetMatch = text.match(/([+-])\s*(\d+)/);
    const offset = isZodiacOffsetText ? 0 : offsetMatch ? Number(`${offsetMatch[1]}${offsetMatch[2]}`) : 0;
    const leftRight = text.match(/左\s*(\d+)\s*右\s*(\d+)/);
    const bothSide = text.match(/左右各\s*(\d+)/);
    const issueNumbers = [
        ...text.matchAll(/(?:20)?(\d{3})/g)
    ].map((match)=>Number(match[1]));
    const currentSuffix = currentIssue ? Number(currentIssue.replace(/\D/g, "").slice(-3)) : undefined;
    const verifyOffset = issueNumbers.length >= 2 ? Math.max(1, issueNumbers[1] - issueNumbers[0]) : issueNumbers.length === 1 && currentSuffix ? Math.max(1, issueNumbers[0] - currentSuffix) : 1;
    const intent = isSixZodiacText ? "six_zodiac" : /七尾|尾数|左右/.test(text) ? "seven_tail" : isZodiacOffsetText ? "nine_zodiac" : /八肖/.test(text) ? "eight_zodiac" : /杀.*尾/.test(text) ? "kill_tail" : /杀.*合/.test(text) ? "kill_sum" : /杀/.test(text) ? "kill_zodiac" : "include_zodiac";
    const leftRightOffsets = leftRight ? Array.from({
        length: Number(leftRight[1]) + Number(leftRight[2]) + 1
    }, (_, index)=>index - Number(leftRight[1])).join(",") : undefined;
    return {
        position,
        offset,
        intent,
        verifyOffset,
        tailMode: leftRight ? "left2right4" : bothSide ? "window3" : /七尾|尾数|左右/.test(text) ? "custom" : "window3",
        customTailOffsets: leftRightOffsets ?? (bothSide ? Array.from({
            length: Number(bothSide[1]) * 2 + 1
        }, (_, index)=>index - Number(bothSide[1])).join(",") : "-3,-2,-1,0,1,2,4"),
        zodiacOffsets: isSixZodiacText && zodiacSetOffsets ? normalizeZodiacSetOffsetText(zodiacSetOffsets) : isZodiacOffsetText && compactOffsets?.[1] ? compactOffsets[1].startsWith("+") || compactOffsets[1].startsWith("-") ? compactOffsets[1] : `+${compactOffsets[1]}` : "+1234567911",
        positionPattern: inferredPositionPattern.join(",")
    };
}
function NewRuleBuilder({ onSave, draw, config, periodIndex }) {
    const [mode, setMode] = (0,react.useState)("paste");
    const [rawText, setRawText] = (0,react.useState)("平码3虎05取值+1234567911");
    const [intent, setIntent] = (0,react.useState)("nine_zodiac");
    const [position, setPosition] = (0,react.useState)(3);
    const [valueKind, setValueKind] = (0,react.useState)("number");
    const [offset, setOffset] = (0,react.useState)(0);
    const [tailMode, setTailMode] = (0,react.useState)("window3");
    const [customTailOffsets, setCustomTailOffsets] = (0,react.useState)("-3,-2,-1,0,1,2,4");
    const [zodiacOffsets, setZodiacOffsets] = (0,react.useState)("+1234567911");
    const [verifyOffset, setVerifyOffset] = (0,react.useState)(1);
    const [positionPattern, setPositionPattern] = (0,react.useState)("");
    const [ruleName, setRuleName] = (0,react.useState)("");
    const [saveStatus, setSaveStatus] = (0,react.useState)("");
    function applyRawText() {
        const inferred = inferRuleText(rawText, draw?.issue);
        setIntent(inferred.intent);
        setPosition(inferred.position);
        setOffset(inferred.offset);
        setTailMode(inferred.tailMode);
        setCustomTailOffsets(inferred.customTailOffsets);
        setZodiacOffsets(inferred.zodiacOffsets);
        setVerifyOffset(inferred.verifyOffset);
        setPositionPattern(inferred.positionPattern);
        if (!ruleName) setRuleName(builderName(inferred.intent, inferred.position, valueKind));
    }
    const formula = buildFormulaText(position, valueKind, offset);
    const normalizer = normalizerForBuilder(intent, tailMode, customTailOffsets, zodiacOffsets);
    const target = targetForBuilder(intent);
    const resolvedName = ruleName.trim() || builderName(intent, position, valueKind);
    const selectedZodiacOffsets = (0,react.useMemo)(()=>parseCompactOffsetText(zodiacOffsets), [
        zodiacOffsets
    ]);
    function toggleZodiacOffset(value) {
        const current = selectedZodiacOffsets;
        const next = current.includes(value) ? current.filter((item)=>item !== value) : [
            ...current,
            value
        ].sort((a, b)=>a - b);
        setZodiacOffsets(formatOffsetList(next));
    }
    const formData = (0,react.useMemo)(()=>{
        const data = new FormData();
        data.set("name", resolvedName);
        data.set("category", intent);
        data.set("orderMode", "L");
        data.set("formula", formula);
        data.set("normalizer", normalizer);
        data.set("target", target);
        data.set("periodSpan", String(Math.max(1, verifyOffset)));
        data.set("verifyOffset", String(Math.max(1, verifyOffset)));
        data.set("positionPattern", positionPattern);
        data.set("sourceType", "manual");
        data.set("sourceFile", mode === "paste" ? "粘贴原文识别" : "常用模板添加");
        data.set("description", rawText ? `原文：${rawText}` : "通过新增规则页面生成");
        data.set("tags", "新增规则");
        data.set("enabled", "on");
        data.set("manuallyConfirmed", "on");
        data.set("participatesInReference", "on");
        return data;
    }, [
        resolvedName,
        intent,
        formula,
        normalizer,
        target,
        verifyOffset,
        positionPattern,
        mode,
        rawText
    ]);
    const trial = (0,react.useMemo)(()=>{
        if (!draw) return {
            error: "暂无可试算开奖数据"
        };
        try {
            const rule = buildRuleFromFormData(formData, {
                forceNew: true
            });
            const calculation = runRuleCalculation(rule, draw, config, {
                periodIndex
            });
            return {
                rule,
                calculation
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, [
        formData,
        draw,
        config,
        periodIndex
    ]);
    async function save() {
        if ("error" in trial) {
            setSaveStatus(`暂不能保存：${trial.error}`);
            return;
        }
        const result = await onSave(formData);
        setSaveStatus(result.message);
    }
    if (mode === "advanced") {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "grid grid-cols-1 gap-4 xl:grid-cols-[260px_1fr]",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                    className: "p-5",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                            className: "font-semibold text-white",
                            children: "新增规则"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mt-4 grid gap-2",
                            children: [
                                "paste",
                                "template",
                                "advanced"
                            ].map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                    type: "button",
                                    onClick: ()=>setMode(item),
                                    className: cn("rounded-lg border px-3 py-3 text-left text-sm", mode === item ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-50" : "border-white/[0.08] bg-white/[0.03] text-slate-300"),
                                    children: item === "paste" ? "粘贴原文识别" : item === "template" ? "常用模板添加" : "高级编辑"
                                }, item))
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "mt-4 text-sm leading-6 text-slate-500",
                            children: "高级编辑保留旧公式输入方式，普通新增规则建议用前两个入口。"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(RuleForm, {
                    selectedRule: undefined,
                    onSave: onSave,
                    compact: true,
                    draw: draw,
                    config: config,
                    periodIndex: periodIndex
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                                        className: "font-semibold text-white",
                                        children: "新增规则"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 text-sm leading-6 text-slate-500",
                                        children: "普通用户只需要粘贴原文或选模板；平/落/特码这些同义词由系统内部统一处理。"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "grid grid-cols-3 gap-2 rounded-md border border-white/[0.07] bg-black/15 p-1",
                                children: [
                                    "paste",
                                    "template",
                                    "advanced"
                                ].map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                        type: "button",
                                        onClick: ()=>setMode(item),
                                        className: cn("h-9 rounded px-3 text-xs font-medium transition", mode === item ? "bg-cyan-300/14 text-cyan-50" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"),
                                        children: item === "paste" ? "原文识别" : item === "template" ? "模板添加" : "高级"
                                    }, item))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 break-words rounded-md border border-cyan-300/15 bg-cyan-300/[0.05] p-3 text-xs leading-5 text-cyan-50/85",
                        children: "已简化：第1位=平1=落1，特码=平7=落7=特号；合尾=合数尾，五行值=行，波色值=波。页面只显示一种说法。"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-5",
                        children: mode === "paste" ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "font-semibold text-white",
                                    children: "粘贴原文识别"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1 text-sm text-slate-500",
                                    children: "例如：平码3虎05取值+1234567911，或 176特码10 预测178尾数左右各3。"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Textarea, {
                                    value: rawText,
                                    onChange: (event)=>setRawText(event.target.value),
                                    className: "mt-4 min-h-28 sm:min-h-32"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mt-4 grid grid-cols-2 gap-2 sm:flex",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                            className: "w-full sm:w-auto",
                                            type: "button",
                                            onClick: applyRawText,
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(search/* default */.A, {
                                                    className: "h-4 w-4"
                                                }),
                                                "开始理解"
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                            className: "w-full sm:w-auto xl:hidden",
                                            variant: "primary",
                                            type: "button",
                                            disabled: "error" in trial,
                                            onClick: ()=>void save(),
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                    className: "h-4 w-4"
                                                }),
                                                "保存规则"
                                            ]
                                        })
                                    ]
                                }),
                                saveStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: cn("mt-3 text-sm xl:hidden", saveStatus.includes("失败") || saveStatus.includes("暂不能") || saveStatus.includes("已存在") ? "text-rose-100" : "text-emerald-100"),
                                    children: saveStatus
                                })
                            ]
                        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                    className: "font-semibold text-white",
                                    children: "常用模板添加"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1 text-sm text-slate-500",
                                    children: "选择规则用途、位置和取值方式，系统自动生成内部公式。"
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-5 rounded-md border border-cyan-300/20 bg-cyan-300/[0.055] p-4 xl:hidden",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "text-xs font-medium text-cyan-100",
                                                children: "当前机器理解"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-1 text-sm leading-6 text-slate-200",
                                                children: [
                                                    "取",
                                                    positionLabel(position),
                                                    "的",
                                                    builderValueOptions.find((item)=>item.value === valueKind)?.label,
                                                    "，",
                                                    offset ? `执行 ${offset > 0 ? "+" : ""}${offset}` : "不加减",
                                                    "，用于",
                                                    builderIntentOptions.find((item)=>item.value === intent)?.label,
                                                    "。"
                                                ]
                                            }),
                                            "error" in trial ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "mt-2 text-xs text-rose-200",
                                                children: trial.error
                                            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-2 text-xs text-slate-400",
                                                children: [
                                                    "本期输出：",
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                        className: "text-white",
                                                        children: trial.calculation.mappedResult.join("、")
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "error" in trial ? "rose" : "green",
                                        children: "error" in trial ? "待修正" : "可保存"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                className: "mt-4 w-full",
                                variant: "primary",
                                type: "button",
                                disabled: "error" in trial,
                                onClick: ()=>void save(),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "保存到规则库"
                                ]
                            }),
                            saveStatus && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: cn("mt-3 text-sm", saveStatus.includes("失败") || saveStatus.includes("暂不能") || saveStatus.includes("已存在") ? "text-rose-100" : "text-emerald-100"),
                                children: saveStatus
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                        className: "mt-5 rounded-md border border-white/[0.08] bg-white/[0.03] p-4",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                className: "cursor-pointer text-sm font-medium text-cyan-100",
                                children: "修改识别结果"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "规则名称"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                value: ruleName,
                                                onChange: (event)=>setRuleName(event.target.value),
                                                placeholder: resolvedName
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "规则用途"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                value: intent,
                                                onChange: (event)=>setIntent(event.target.value),
                                                children: builderIntentOptions.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: item.value,
                                                        children: item.label
                                                    }, item.value))
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "取哪个位置"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                value: String(position),
                                                onChange: (event)=>setPosition(Number(event.target.value)),
                                                children: [
                                                    1,
                                                    2,
                                                    3,
                                                    4,
                                                    5,
                                                    6,
                                                    7
                                                ].map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: item,
                                                        children: positionLabel(item)
                                                    }, item))
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "取什么值"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                                value: valueKind,
                                                onChange: (event)=>setValueKind(event.target.value),
                                                children: builderValueOptions.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: item.value,
                                                        children: item.label
                                                    }, item.value))
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "加减计算"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                type: "number",
                                                value: offset,
                                                onChange: (event)=>setOffset(Number(event.target.value || 0))
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "验证间隔"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                type: "number",
                                                min: 1,
                                                max: 8,
                                                value: verifyOffset,
                                                onChange: (event)=>setVerifyOffset(Number(event.target.value || 1))
                                            })
                                        ]
                                    })
                                ]
                            }),
                            intent === "seven_tail" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr]",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "七尾闭环方式"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                                value: tailMode,
                                                onChange: (event)=>setTailMode(event.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: "window3",
                                                        children: "以尾数为中心左右各3"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: "left2right4",
                                                        children: "左2右4"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                        value: "custom",
                                                        children: "自定义偏移"
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                children: "自定义偏移"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                value: customTailOffsets,
                                                onChange: (event)=>setCustomTailOffsets(event.target.value),
                                                placeholder: "-3,-2,-1,0,1,2,4"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            (intent === "nine_zodiac" || intent === "six_zodiac") && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 rounded-lg border border-white/[0.08] bg-black/15 p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "min-w-0 flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                                        children: intent === "six_zodiac" ? "生肖偏移（点几个就是几肖）" : "九肖取值"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                                        value: zodiacOffsets,
                                                        onChange: (event)=>setZodiacOffsets(event.target.value),
                                                        placeholder: intent === "six_zodiac" ? "例如 012348" : "+1234567911"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                tone: "cyan",
                                                children: [
                                                    "已选 ",
                                                    selectedZodiacOffsets.length,
                                                    " 个"
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "mt-3 grid grid-cols-5 gap-2 sm:grid-cols-9 xl:grid-cols-[repeat(13,minmax(0,1fr))]",
                                        children: Array.from({
                                            length: 25
                                        }, (_, index)=>index - 12).map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                type: "button",
                                                onClick: ()=>toggleZodiacOffset(item),
                                                className: cn("h-9 rounded-md border text-xs font-semibold transition", selectedZodiacOffsets.includes(item) ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-50" : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"),
                                                children: item >= 0 ? `+${item}` : item
                                            }, item))
                                    }),
                                    intent === "six_zodiac" && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 text-xs text-slate-500",
                                        children: "例：取位循环填 3,2,1 或 平321.321，偏移填 0,1,2,3,4,8，就是平3+0、平2+1、平1+2、平3+3、平2+4、平1+8。"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "取位循环（可选）"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        value: positionPattern,
                                        onChange: (event)=>setPositionPattern(event.target.value),
                                        placeholder: "例如 平321.321、平1234567.1234567. 或 平7654321.7654321."
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-5 2xl:sticky 2xl:top-28 2xl:self-start",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                        className: "font-semibold text-white",
                        children: "机器理解与试算"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-4 space-y-3 text-sm text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "我理解为"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-2",
                                        children: [
                                            "取 ",
                                            positionLabel(position),
                                            " 的 ",
                                            builderValueOptions.find((item)=>item.value === valueKind)?.label,
                                            "，执行 ",
                                            offset ? `${offset > 0 ? "+" : ""}${offset}` : "不加减",
                                            "，用途是 ",
                                            builderIntentOptions.find((item)=>item.value === intent)?.label,
                                            "。"
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "内部公式"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 font-mono text-cyan-100",
                                        children: formula
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-1 text-xs text-slate-500",
                                        children: [
                                            "归一化：",
                                            normalizer
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "当前期试算"
                                    }),
                                    "error" in trial ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 text-rose-200",
                                        children: trial.error
                                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-2 text-slate-400",
                                                children: [
                                                    draw?.issue ?? "-",
                                                    "期：",
                                                    drawNumbersWithZodiac(draw, config)
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-2 font-mono text-cyan-100",
                                                children: [
                                                    trial.calculation.expression,
                                                    " = ",
                                                    trial.calculation.rawResult
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-2 text-white",
                                                children: [
                                                    "输出：",
                                                    trial.calculation.mappedResult.join("、")
                                                ]
                                            }),
                                            trial.calculation.secondaryMappedResult?.length ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "mt-1 text-xs text-slate-500",
                                                children: [
                                                    "对应号码：",
                                                    trial.calculation.secondaryMappedResult.map((item)=>typeof item === "number" ? rulequant_terminal_numberWithZodiac(item, config) : item).join("、")
                                                ]
                                            }) : null
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    saveStatus && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: cn("mt-4 rounded-lg border p-3 text-sm", saveStatus.includes("失败") || saveStatus.includes("暂不能") || saveStatus.includes("已存在") ? "border-rose-300/25 bg-rose-300/10 text-rose-100" : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"),
                        children: [
                            saveStatus,
                            !saveStatus.includes("失败") && !saveStatus.includes("暂不能") && !saveStatus.includes("已存在") && /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                href: "/rules",
                                className: "ml-3 text-cyan-100 underline-offset-4 hover:underline",
                                children: "去公式管理查看"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        className: "mt-4 w-full",
                        variant: "primary",
                        type: "button",
                        onClick: ()=>void save(),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            "保存到规则库"
                        ]
                    })
                ]
            })
        ]
    });
}
function RuleForm({ selectedRule, onSave, compact = false, draw, config, periodIndex }) {
    const [formulaText, setFormulaText] = (0,react.useState)(selectedRule?.formula ?? "平1 + 特码尾");
    const [trialResult, setTrialResult] = (0,react.useState)(null);
    const formRef = (0,react.useRef)(null);
    const textareaRef = (0,react.useRef)(null);
    const [saveStatus, setSaveStatus] = (0,react.useState)("");
    const variableGroups = [
        {
            title: "位置",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位`,
                        value: `平${index + 1}`
                    })),
                {
                    label: "特码",
                    value: "特码"
                }
            ]
        },
        {
            title: "取值",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>[
                        {
                            label: `第${index + 1}位头`,
                            value: `平${index + 1}头`
                        },
                        {
                            label: `第${index + 1}位尾`,
                            value: `平${index + 1}尾`
                        },
                        {
                            label: `第${index + 1}位合`,
                            value: `平${index + 1}合`
                        },
                        {
                            label: `第${index + 1}位合尾`,
                            value: `平${index + 1}合尾`
                        }
                    ]).flat(),
                {
                    label: "特码头",
                    value: "特码头"
                },
                {
                    label: "特码尾",
                    value: "特码尾"
                },
                {
                    label: "特码合",
                    value: "特码合"
                },
                {
                    label: "特码合尾",
                    value: "特码合尾"
                }
            ]
        },
        {
            title: "段位",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位段`,
                        value: `平${index + 1}段`
                    })),
                {
                    label: "特码段",
                    value: "特码段"
                }
            ]
        },
        {
            title: "波色值",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位波色值`,
                        value: `平${index + 1}波色值`
                    })),
                {
                    label: "特码波色值",
                    value: "特码波色值"
                }
            ]
        },
        {
            title: "五行值",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位五行值`,
                        value: `平${index + 1}五行值`
                    })),
                {
                    label: "特码五行值",
                    value: "特码五行值"
                }
            ]
        },
        {
            title: "单双大小",
            items: [
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位单双`,
                        value: `平${index + 1}单双`
                    })),
                {
                    label: "特码单双",
                    value: "特码单双"
                },
                ...Array.from({
                    length: 6
                }, (_, index)=>({
                        label: `第${index + 1}位大小`,
                        value: `平${index + 1}大小`
                    })),
                {
                    label: "特码大小",
                    value: "特码大小"
                }
            ]
        },
        {
            title: "总数期号",
            items: [
                "总数",
                "总数尾",
                "总数合",
                "期号尾",
                "期数尾",
                "期合",
                "期合尾"
            ].map((item)=>({
                    label: item,
                    value: item
                }))
        }
    ];
    function getCurrentFormData() {
        if (!formRef.current) return undefined;
        const formData = new FormData(formRef.current);
        formData.set("formula", formulaText);
        return formData;
    }
    function insertVariable(variable) {
        const textarea = textareaRef.current;
        const start = textarea?.selectionStart ?? formulaText.length;
        const end = textarea?.selectionEnd ?? formulaText.length;
        const next = `${formulaText.slice(0, start)}${variable}${formulaText.slice(end)}`;
        setFormulaText(next);
        window.requestAnimationFrame(()=>{
            textarea?.focus();
            textarea?.setSelectionRange(start + variable.length, start + variable.length);
        });
    }
    function tryCalculateDraft() {
        if (!draw || !config) {
            setTrialResult({
                error: "暂无可试算开奖数据。"
            });
            return;
        }
        const formData = getCurrentFormData();
        if (!formData) return;
        try {
            const rule = buildRuleFromFormData(formData, {
                existingRule: selectedRule,
                forceNew: !selectedRule
            });
            const calculation = runRuleCalculation(rule, draw, config, {
                periodIndex
            });
            setTrialResult({
                rule,
                calculation
            });
        } catch (error) {
            setTrialResult({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = getCurrentFormData();
        if (!formData) return;
        if (draw && config) {
            try {
                const rule = buildRuleFromFormData(formData, {
                    existingRule: selectedRule,
                    forceNew: !selectedRule
                });
                runRuleCalculation(rule, draw, config, {
                    periodIndex
                });
            } catch (error) {
                const message = `保存前检查失败：${error instanceof Error ? error.message : String(error)}`;
                setTrialResult({
                    error: message
                });
                setSaveStatus(message);
                return;
            }
        }
        const result = await onSave(formData);
        setSaveStatus(result.message);
        if (!result.ok) {
            setTrialResult({
                error: result.message
            });
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                className: "font-semibold text-white",
                children: selectedRule ? "编辑规则" : "新增规则"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                ref: formRef,
                onSubmit: handleSubmit,
                className: "mt-4 space-y-3",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                        type: "hidden",
                        name: "id",
                        defaultValue: selectedRule?.id ?? ""
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "规则名"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                name: "name",
                                defaultValue: selectedRule?.name ?? ""
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "类型"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                        name: "category",
                                        defaultValue: selectedRule?.category ?? "kill_zodiac",
                                        children: categories.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: item.value,
                                                children: item.label
                                            }, item.value))
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "序列"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Select, {
                                        name: "orderMode",
                                        defaultValue: selectedRule?.orderMode ?? "L",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "L",
                                                children: "L序"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "D",
                                                children: "D序"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "custom",
                                                children: "自定义"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "公式"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Textarea, {
                                ref: textareaRef,
                                name: "formula",
                                value: formulaText,
                                onChange: (event)=>setFormulaText(event.target.value),
                                className: compact ? "min-h-24 font-mono" : "font-mono"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-3 flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                        type: "button",
                                        onClick: tryCalculateDraft,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(play/* default */.A, {
                                                className: "h-4 w-4"
                                            }),
                                            "试算当前公式"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                        variant: "primary",
                                        type: "submit",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                                className: "h-4 w-4"
                                            }),
                                            selectedRule ? "保存修改" : "保存为新公式"
                                        ]
                                    })
                                ]
                            }),
                            trialResult?.error && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "mt-3 rounded-lg border border-rose-300/25 bg-rose-300/10 p-3 text-sm text-rose-100",
                                children: trialResult.error
                            }),
                            saveStatus && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: cn("mt-3 rounded-lg border p-3 text-sm", saveStatus.includes("失败") || saveStatus.includes("暂不能") || saveStatus.includes("已存在") ? "border-rose-300/25 bg-rose-300/10 text-rose-100" : "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"),
                                children: [
                                    saveStatus,
                                    !saveStatus.includes("失败") && !saveStatus.includes("暂不能") && !saveStatus.includes("已存在") && /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                        href: "/rules",
                                        className: "ml-3 text-cyan-100 underline-offset-4 hover:underline",
                                        children: "去公式管理查看"
                                    })
                                ]
                            }),
                            trialResult?.calculation && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-3 text-xs text-slate-300",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: "font-medium text-white",
                                                children: "草稿试算"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                tone: "cyan",
                                                children: trialResult.calculation.mappedResult.join("、")
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 font-mono text-cyan-100",
                                        children: trialResult.calculation.expression
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-1 font-mono text-white",
                                        children: [
                                            "rawResult：",
                                            trialResult.calculation.rawResult
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                className: cn("mt-3 rounded-lg border border-white/[0.08] bg-white/[0.025] p-3", compact && "max-h-[760px] overflow-auto pr-1"),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                        className: "cursor-pointer text-sm font-medium text-slate-300",
                                        children: "高级变量按钮"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-2 text-xs leading-5 text-slate-500",
                                        children: "这里已经去掉重复同义词。显示“第1位”，内部仍插入引擎可识别的“平1”。"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "mt-3 space-y-3",
                                        children: variableGroups.map((group)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                        className: "mb-2 text-xs text-slate-500",
                                                        children: group.title
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: group.items.map((variable)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                                                type: "button",
                                                                onClick: ()=>insertVariable(variable.value),
                                                                className: "rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white",
                                                                children: variable.label
                                                            }, variable.value))
                                                    })
                                                ]
                                            }, group.title))
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "归一化"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "normalizer",
                                        defaultValue: selectedRule?.normalizer ?? "auto"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "目标"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "target",
                                        defaultValue: selectedRule?.target ?? "special"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "管期"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "periodSpan",
                                        type: "number",
                                        min: 1,
                                        max: 2,
                                        defaultValue: selectedRule?.periodSpan ?? 1
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "平位序列"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "positionPattern",
                                        defaultValue: selectedRule?.positionPattern?.join(",") ?? ""
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "锚点期号"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "anchorIssue",
                                        defaultValue: selectedRule?.anchorIssue ?? "",
                                        placeholder: "例如 2026169"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                        children: "锚点序列位置"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                        name: "anchorPatternIndex",
                                        type: "number",
                                        min: 0,
                                        defaultValue: selectedRule?.anchorPatternIndex ?? ""
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "位置含义"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                name: "positionMeaning",
                                defaultValue: selectedRule?.positionMeaning ?? "1=平1，2=平2，7=特码"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "标签"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                name: "tags",
                                defaultValue: selectedRule?.tags?.join(" ") ?? ""
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "公式来源"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Select, {
                                name: "sourceType",
                                defaultValue: selectedRule?.sourceType ?? "manual",
                                children: extendedSourceTypeOptions.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                        value: item.value,
                                        children: item.label
                                    }, item.value))
                            })
                        ]
                    }),
                    !compact && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "来源文件"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Input, {
                                name: "sourceFile",
                                defaultValue: selectedRule?.sourceFile ?? "手动录入"
                            })
                        ]
                    }),
                    !compact && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Label, {
                                children: "说明"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Textarea, {
                                name: "description",
                                defaultValue: selectedRule?.description ?? ""
                            })
                        ]
                    }),
                    compact && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                type: "hidden",
                                name: "sourceFile",
                                defaultValue: selectedRule?.sourceFile ?? "手动录入"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                type: "hidden",
                                name: "description",
                                defaultValue: selectedRule?.description ?? ""
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                        className: "flex items-center gap-2 text-sm text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                name: "enabled",
                                type: "checkbox",
                                defaultChecked: selectedRule?.enabled ?? true
                            }),
                            " 启用规则"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                        className: "flex items-center gap-2 text-sm text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                name: "manuallyConfirmed",
                                type: "checkbox",
                                defaultChecked: selectedRule?.manuallyConfirmed ?? false
                            }),
                            " 标记用户确认"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                        className: "flex items-center gap-2 text-sm text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                name: "participatesInReference",
                                type: "checkbox",
                                defaultChecked: selectedRule?.participatesInReference !== false
                            }),
                            " 允许参与综合参考"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                        variant: "primary",
                        type: "submit",
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                className: "h-4 w-4"
                            }),
                            selectedRule ? "保存修改" : "保存为新公式"
                        ]
                    })
                ]
            }),
            !compact && trialResult?.error && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 rounded-lg border border-rose-300/25 bg-rose-300/10 p-4 text-sm text-rose-100",
                children: trialResult.error
            }),
            !compact && trialResult?.calculation && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 space-y-3 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-sm font-medium text-white",
                                        children: "当前草稿试算结果"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        className: "mt-1 text-xs text-slate-400",
                                        children: [
                                            draw?.issue ?? "-",
                                            " 期 \xb7 ",
                                            trialResult.rule.name
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                tone: "cyan",
                                children: trialResult.calculation.mappedResult.join("、")
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "表达式"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 font-mono text-cyan-100",
                                        children: trialResult.calculation.expression
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "rawResult"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 font-mono text-white",
                                        children: trialResult.calculation.rawResult
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.08] bg-black/20 p-3 text-xs text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mb-2 text-slate-500",
                                children: "变量取值"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "font-mono",
                                children: Object.entries(trialResult.calculation.variables).map(([key, value])=>`${key}=${value}`).join(" / ") || "-"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-md border border-white/[0.08] bg-black/20 p-3 text-xs text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mb-2 text-slate-500",
                                children: "归一化与输出"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "归一化过程：",
                                    trialResult.calculation.normalizerSteps.join(" -> ")
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "最终输出：",
                                    Array.isArray(trialResult.calculation.finalResult) ? trialResult.calculation.finalResult.join("、") : trialResult.calculation.finalResult
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "映射结果：",
                                    trialResult.calculation.mappedResult.join("、")
                                ]
                            })
                        ]
                    })
                ]
            }),
            !compact && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-5 border-t border-white/[0.08] pt-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                        className: "mb-2 text-sm font-medium text-white",
                        children: "TXT 原文库"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "max-h-40 space-y-1 overflow-auto text-xs text-slate-500",
                        children: rawRuleFiles.map((file)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                children: file
                            }, file))
                    })
                ]
            })
        ]
    });
}
function FormulaWorkbench({ rule, draw, config, periodIndex }) {
    const result = (0,react.useMemo)(()=>{
        if (!draw) return null;
        try {
            return {
                calculation: runRuleCalculation(rule, draw, config, {
                    periodIndex
                })
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, [
        rule,
        draw,
        config,
        periodIndex
    ]);
    const calculation = result?.calculation;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                className: "font-semibold text-white",
                children: "单期试算"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "text-sm text-slate-500",
                children: [
                    "当前试算期：",
                    draw?.issue ?? "-"
                ]
            }),
            calculation ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-5 space-y-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-lg border border-white/[0.08] bg-black/20 p-4",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-xs text-slate-500",
                                children: "输出结果"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 text-[28px] font-semibold leading-tight text-cyan-100",
                                children: calculation.mappedResult.join("、")
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "rawResult"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "font-mono text-white",
                                        children: calculation.rawResult
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-slate-500",
                                        children: "finalResult"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "font-mono text-white",
                                        children: Array.isArray(calculation.finalResult) ? calculation.finalResult.join("、") : calculation.finalResult
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "mb-2 text-sm font-medium text-white",
                                children: "计算过程"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "space-y-2",
                                children: calculation.process.map((line)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                        className: "rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-300",
                                        children: line
                                    }, line))
                            })
                        ]
                    })
                ]
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-4 text-sm text-rose-200",
                children: result?.error ?? "暂无可试算数据"
            })
        ]
    });
}
function ProcessInspector({ detail }) {
    if (!detail) return null;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                className: "font-semibold text-white",
                children: "计算过程展开"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "space-y-2 text-sm text-slate-300",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "当前期：",
                                    detail.currentIssue
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "L序：",
                                    detail.lOrder.join(" ")
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "D序：",
                                    detail.dOrder.join(" ")
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "下期期号：",
                                    detail.nextIssue
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                children: [
                                    "下期属性：",
                                    detail.nextSpecialAttributes ? `${detail.nextSpecialAttributes.zodiac} / ${detail.nextSpecialAttributes.color} / ${detail.nextSpecialAttributes.element}` : "-"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "space-y-2",
                        children: detail.process.map((line)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-xs text-slate-300",
                                children: line
                            }, line))
                    })
                ]
            })
        ]
    });
}
function evidenceReason(supportRules, opposeRules) {
    const support = supportRules[0];
    const oppose = opposeRules[0];
    if (support && !oppose) return `${support.ruleName} 支持 ${support.targets.join("、")}`;
    if (!support && oppose) return `${oppose.ruleName} 排除 ${oppose.targets.join("、")}`;
    if (support && oppose) return `${support.ruleName} 支持，${oppose.ruleName} 有排除信号`;
    return "暂无明显公式证据";
}
function CandidateNumberList({ items, focus, onFocus, compact = false }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: cn("grid gap-3", compact ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"),
        children: items.map((item, index)=>{
            const active = focus?.type === "number" && focus.value === item.number;
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                onClick: ()=>onFocus({
                        type: "number",
                        value: item.number
                    }),
                className: cn(compact ? "min-w-0 rounded-lg border p-3 text-left transition hover:bg-white/[0.055]" : "min-w-0 rounded-lg border p-3 text-left transition hover:bg-white/[0.055] sm:p-4", active ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/[0.08] bg-white/[0.03]"),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                className: "text-xs text-slate-500",
                                children: [
                                    "#",
                                    index + 1
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                tone: item.opposeCount ? "slate" : "green",
                                children: item.score
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-3 flex items-end justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: cn("font-mono font-semibold leading-none text-white", compact ? "text-[24px] sm:text-[28px]" : "text-[28px] sm:text-[32px]"),
                                children: rulequant_terminal_padNumber(item.number)
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                className: "text-sm text-cyan-100",
                                children: item.zodiac
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        className: "mt-3 text-xs text-slate-500",
                        children: [
                            item.color,
                            " \xb7 ",
                            item.element,
                            " \xb7 尾 ",
                            item.tail,
                            " \xb7 合 ",
                            item.sum,
                            " \xb7 ",
                            item.segment,
                            "段"
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        className: "mt-2 text-xs text-slate-400",
                        children: [
                            "支持 ",
                            item.supportCount,
                            " / 反对 ",
                            item.opposeCount
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-2 line-clamp-2 text-xs text-slate-500",
                        children: evidenceReason(item.supportRules, item.opposeRules)
                    })
                ]
            }, item.number);
        })
    });
}
function CandidateZodiacList({ items, focus, onFocus }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
        children: items.map((item, index)=>{
            const active = focus?.type === "zodiac" && focus.value === item.zodiac;
            return /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                onClick: ()=>onFocus({
                        type: "zodiac",
                        value: item.zodiac
                    }),
                className: cn("min-w-0 rounded-lg border p-3 text-left transition hover:bg-white/[0.055] sm:p-4", active ? "border-cyan-300/35 bg-cyan-300/10" : "border-white/[0.08] bg-white/[0.03]"),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                className: "text-xs text-slate-500",
                                children: [
                                    "#",
                                    index + 1
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                tone: item.opposeCount ? "slate" : "green",
                                children: item.score
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-3 text-[28px] font-semibold leading-none text-white sm:text-[32px]",
                        children: item.zodiac
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-2 break-words font-mono text-xs leading-5 text-cyan-100",
                        children: item.numbers.map(candidateNumberLabel).join("  ")
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        className: "mt-3 text-xs text-slate-500",
                        children: [
                            "支持 ",
                            item.supportCount,
                            " / 反对 ",
                            item.opposeCount
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-2 line-clamp-2 text-xs text-slate-500",
                        children: evidenceReason(item.supportRules, item.opposeRules)
                    })
                ]
            }, item.zodiac);
        })
    });
}
function isCandidateNumber(candidate) {
    return "number" in candidate;
}
function EvidenceList({ title, items, tone }) {
    const primaryItems = items.slice(0, 3);
    const restItems = items.slice(3);
    const renderEvidence = (item, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "rounded-md border border-white/[0.06] bg-white/[0.03] p-3",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "flex items-center justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "truncate text-sm text-slate-200",
                            children: item.ruleName
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                            className: "font-mono text-xs text-cyan-100",
                            children: [
                                item.scoreDelta > 0 ? "+" : "",
                                item.scoreDelta
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "mt-1 font-mono text-xs text-cyan-100",
                    children: item.formula
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    className: "mt-1 text-xs text-slate-500",
                    children: [
                        "对象：",
                        item.targets.join("、"),
                        " \xb7 历史表现 ",
                        item.successRate,
                        "% \xb7 近10期 ",
                        item.recentRate,
                        "%"
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                    className: "mt-1 text-xs text-slate-500",
                    children: [
                        "来源：",
                        sourceTypeLabel(item.sourceType),
                        " \xb7 用户提供：",
                        (item.sourceType ?? "user_provided") === "user_provided" ? "是" : "否",
                        " \xb7 当前连对 ",
                        item.currentStreak,
                        " \xb7 连错 ",
                        item.wrongStreak ?? 0
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                    className: "mt-2",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                            className: "cursor-pointer text-xs text-slate-400",
                            children: "查看公式过程"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mt-2 space-y-1",
                            children: item.process.slice(0, 6).map((line)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "font-mono text-xs text-slate-500",
                                    children: line
                                }, line))
                        })
                    ]
                })
            ]
        }, `${item.ruleId}-${item.action}-${index}`);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mb-2 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h4", {
                        className: "text-sm font-medium text-white",
                        children: title
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: tone,
                        children: items.length
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "space-y-2",
                children: [
                    items.length === 0 && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "rounded-md border border-white/[0.06] bg-white/[0.03] p-3 text-sm text-slate-500",
                        children: "暂无对应证据"
                    }),
                    primaryItems.map(renderEvidence),
                    restItems.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                        className: "rounded-md border border-white/[0.06] bg-black/15 p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("summary", {
                                className: "cursor-pointer text-sm text-slate-300",
                                children: [
                                    "查看全部 ",
                                    items.length,
                                    " 条证据"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "mt-3 space-y-2",
                                children: restItems.map((item, index)=>renderEvidence(item, index + 3))
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function FormulaHealthPanel({ rows, onToggleReserve, compact = false }) {
    const reserveCount = rows.filter((row)=>row.status === "reserve" || row.status === "manual_reserve").length;
    const watchCount = rows.filter((row)=>row.status === "watch").length;
    const visibleRows = compact ? rows.slice(0, 6) : rows.slice(0, 12);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "公式提醒 / 备选库"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "错了会提示；连错较多且命中率不稳的公式建议放入备选库。备选库公式继续回测，只是暂不参与综合参考。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex shrink-0 gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: watchCount ? "yellow" : "green",
                                children: [
                                    "提醒 ",
                                    watchCount
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                tone: reserveCount ? "rose" : "green",
                                children: [
                                    "备选 ",
                                    reserveCount
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 grid gap-2",
                children: visibleRows.map((row)=>{
                    const tone = row.status === "keep" ? "green" : row.status === "watch" ? "yellow" : "rose";
                    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "grid grid-cols-2 items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-sm sm:grid-cols-[1fr_92px_92px_110px] sm:items-center",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex flex-wrap items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                className: "line-clamp-2 break-words font-medium text-white",
                                                children: row.rule.name
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                tone: tone,
                                                children: row.status === "keep" ? "保留" : row.status === "watch" ? "观察" : "备选建议"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "mt-1 text-xs leading-5 text-slate-500",
                                        children: row.reason
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                className: "text-xs text-slate-400",
                                children: [
                                    "连错 ",
                                    row.wrongStreak
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                className: "text-xs text-slate-400",
                                children: [
                                    "命中 ",
                                    row.result?.successRate ?? 0,
                                    "%"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                size: "sm",
                                onClick: ()=>onToggleReserve(row.rule.id),
                                children: row.rule.participatesInReference === false ? "恢复参与" : "放入备选"
                            })
                        ]
                    }, row.rule.id);
                })
            })
        ]
    });
}
function ManualCombinationPanel({ rules, selectedRuleIds, setSelectedRuleIds, report, validationById }) {
    const availableRules = rules.filter((rule)=>canRuleParticipateInReference(rule, validationById.get(rule.id)));
    function toggle(ruleId) {
        setSelectedRuleIds(selectedRuleIds.includes(ruleId) ? selectedRuleIds.filter((id)=>id !== ruleId) : [
            ...selectedRuleIds,
            ruleId
        ]);
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "手动公式组合查看号码"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm text-slate-500",
                                children: "手动勾选几条公式，单独查看这组公式合并后的参考号码和生肖。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                size: "sm",
                                onClick: ()=>setSelectedRuleIds(availableRules.slice(0, 10).map((rule)=>rule.id)),
                                children: "选择前10条"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                size: "sm",
                                onClick: ()=>setSelectedRuleIds([]),
                                children: "清空"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "grid max-h-64 gap-2 overflow-auto pr-1",
                        children: availableRules.map((rule)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                className: "flex cursor-pointer items-center gap-3 rounded-md border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-slate-300 hover:bg-white/[0.06]",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "checkbox",
                                        checked: selectedRuleIds.includes(rule.id),
                                        onChange: ()=>toggle(rule.id)
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "min-w-0 flex-1 truncate",
                                        children: rule.name
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "slate",
                                        children: categoryLabel(rule.category)
                                    })
                                ]
                            }, rule.id))
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "rounded-lg border border-white/[0.08] bg-black/20 p-4",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        className: "text-sm font-medium text-white",
                                        children: "组合结果"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                        tone: "cyan",
                                        children: [
                                            "使用 ",
                                            report.ruleCount,
                                            " 条"
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-3 text-xs text-slate-500",
                                children: "号码 Top 18"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-9",
                                children: [
                                    report.topNumbers18.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                            className: "flex h-9 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.05] px-1 font-mono text-[11px] text-white",
                                            children: candidateNumberLabel(item)
                                        }, item.number)),
                                    !report.topNumbers18.length && /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                        className: "col-span-9 text-sm text-slate-500",
                                        children: "请选择可参与的公式。"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-4 text-xs text-slate-500",
                                children: "生肖 Top 9"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "mt-2 flex flex-wrap gap-2",
                                children: report.topZodiacs9.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                        tone: "violet",
                                        children: item.zodiac
                                    }, item.zodiac))
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function ReferenceEmptyState() {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                tone: "yellow",
                children: "暂无可生成结果"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                className: "mt-3 text-[20px] font-semibold text-white",
                children: "当前没有可参与综合计算的公式"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-2 max-w-2xl text-sm leading-6 text-slate-400",
                children: "请检查公式是否已启用、变量是否能识别、计算是否报错，或是否被手动设置为不参与综合参考。没有公式依据时，系统不会展示 Top 号码或 Top 生肖，避免误导。"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-5 flex flex-wrap gap-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                        href: "/sample-check",
                        className: "inline-flex h-10 items-center justify-center rounded-lg border border-cyan-200/45 bg-cyan-300/18 px-4 text-sm font-medium text-cyan-50 hover:bg-cyan-300/28",
                        children: "查看样例核对"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                        href: "/rules",
                        className: "inline-flex h-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.07] px-4 text-sm font-medium text-white hover:bg-white/[0.11]",
                        children: "去公式管理"
                    })
                ]
            })
        ]
    });
}
function ObservationMetric({ label, hits, total, rate, tone }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "rounded-lg border border-white/[0.08] bg-white/[0.035] p-3",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "text-xs text-slate-500",
                        children: label
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        tone: tone,
                        children: [
                            rate,
                            "%"
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                className: "mt-2 font-mono text-[24px] font-semibold text-white",
                children: [
                    hits,
                    "/",
                    total
                ]
            })
        ]
    });
}
function HitBadge({ hit, label }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
        tone: hit ? "green" : "rose",
        children: [
            label,
            hit ? "中" : "未中"
        ]
    });
}
function ReferenceObservationPanel({ report }) {
    const rows = [
        ...report.items
    ].reverse();
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "综合推荐近10期观察"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 text-sm leading-6 text-slate-500",
                                children: "每一期都只用上一期以前的数据生成综合推荐，再拿本期开奖特码核对。这个是观察概率，不代表后面一定会中。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        tone: "cyan",
                        children: [
                            "观察 ",
                            report.total,
                            "/",
                            report.window,
                            " 期"
                        ]
                    })
                ]
            }),
            report.total === 0 ? /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-500",
                children: "数据还不够，暂时不能观察最近10期综合推荐表现。"
            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ObservationMetric, {
                                label: "重点号码 Top8",
                                hits: report.top8Hits,
                                total: report.total,
                                rate: report.top8Rate,
                                tone: "green"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ObservationMetric, {
                                label: "次选号码 Top12",
                                hits: report.top12Hits,
                                total: report.total,
                                rate: report.top12Rate,
                                tone: "cyan"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ObservationMetric, {
                                label: "宽参考 Top18",
                                hits: report.top18Hits,
                                total: report.total,
                                rate: report.top18Rate,
                                tone: "violet"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ObservationMetric, {
                                label: "生肖 Top7",
                                hits: report.zodiac7Hits,
                                total: report.total,
                                rate: report.zodiac7Rate,
                                tone: "yellow"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(ObservationMetric, {
                                label: "生肖 Top9",
                                hits: report.zodiac9Hits,
                                total: report.total,
                                rate: report.zodiac9Rate,
                                tone: "yellow"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 space-y-2",
                        children: rows.map((item)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                        className: "font-medium text-white",
                                                        children: [
                                                            item.issue,
                                                            "期：开 ",
                                                            rulequant_terminal_padNumber(item.special),
                                                            " ",
                                                            item.zodiac
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                        className: "mt-1 text-xs text-slate-500",
                                                        children: [
                                                            "用 ",
                                                            item.previousIssue ?? "-",
                                                            " 期以前数据生成，参与公式 ",
                                                            item.ruleCount,
                                                            " 条，证据 ",
                                                            item.signalCount,
                                                            " 条。"
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                                                        tone: item.hitNumberRank <= 18 ? "cyan" : "yellow",
                                                        children: [
                                                            "49码排第 ",
                                                            item.hitNumberRank,
                                                            " 位"
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(HitBadge, {
                                                        hit: item.hitTop8,
                                                        label: "Top8"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(HitBadge, {
                                                        hit: item.hitTop12,
                                                        label: "Top12"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(HitBadge, {
                                                        hit: item.hitTop18,
                                                        label: "Top18"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(HitBadge, {
                                                        hit: item.hitZodiac7,
                                                        label: "肖7"
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(HitBadge, {
                                                        hit: item.hitZodiac9,
                                                        label: "肖9"
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: "mt-3 grid grid-cols-1 gap-2 text-xs lg:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "font-mono text-cyan-100",
                                                children: [
                                                    "Top8：",
                                                    item.top8Numbers.map(rulequant_terminal_padNumber).join("、") || "-"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "font-mono text-cyan-100",
                                                children: [
                                                    "Top12：",
                                                    item.top12Numbers.map(rulequant_terminal_padNumber).join("、") || "-"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "font-mono text-cyan-100 lg:col-span-2",
                                                children: [
                                                    "Top18：",
                                                    item.top18Numbers.map(rulequant_terminal_padNumber).join("、") || "-"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "font-mono text-amber-100",
                                                children: [
                                                    "生肖Top7：",
                                                    item.top7Zodiacs.join("、") || "-"
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                className: "font-mono text-amber-100",
                                                children: [
                                                    "生肖Top9：",
                                                    item.top9Zodiacs.join("、") || "-"
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }, item.issue))
                    })
                ]
            })
        ]
    });
}
function ReferenceHistoryNumberList({ items, config, limit }) {
    const displayItems = limit ? items.slice(0, limit) : items;
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "grid grid-cols-[repeat(auto-fill,minmax(5.75rem,1fr))] gap-2",
        children: [
            displayItems.map((item, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                    className: cn("flex min-h-9 min-w-0 items-center justify-center rounded-md border px-2 py-1 text-center font-mono text-[12px] leading-4", item.hit ? "border-emerald-300/45 bg-emerald-300/14 text-emerald-50" : "border-white/[0.08] bg-white/[0.04] text-cyan-50"),
                    title: `${rulequant_terminal_padNumber(item.number)} ${item.zodiac}，排名 ${item.rank}，支持 ${item.supportCount}，反对 ${item.opposeCount}`,
                    children: [
                        item.rank ? `${item.rank}. ` : "",
                        rulequant_terminal_numberWithZodiac(item.number, config),
                        item.hit ? " 命中" : ""
                    ]
                }, `${item.number}-${index}`)),
            limit && items.length > limit ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                className: "text-xs text-slate-500",
                children: [
                    "+",
                    items.length - limit
                ]
            }) : null,
            !displayItems.length ? /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "text-xs text-slate-500",
                children: "暂无"
            }) : null
        ]
    });
}
function ReferenceHistoryZodiacList({ items }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-2",
        children: [
            items.map((item, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                    className: cn("flex min-h-9 min-w-0 items-center justify-center rounded-md border px-2 py-1 text-center text-[12px] leading-4", item.hit ? "border-emerald-300/45 bg-emerald-300/14 text-emerald-50" : "border-violet-300/15 bg-violet-300/[0.07] text-violet-50"),
                    title: `${item.zodiac}，排名 ${item.rank}，支持 ${item.supportCount}，反对 ${item.opposeCount}`,
                    children: [
                        item.rank ? `${item.rank}. ` : "",
                        item.zodiac,
                        item.hit ? " 命中" : ""
                    ]
                }, `${item.zodiac}-${index}`)),
            !items.length ? /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                className: "text-xs text-slate-500",
                children: "暂无"
            }) : null
        ]
    });
}
function ReferenceHistoryHitSummary({ record }) {
    if (!record.actualSpecial) {
        return /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
            tone: "yellow",
            children: "等待下一期开奖"
        });
    }
    const rank = record.outcome?.hitNumberRank;
    const bandLabel = !rank ? "49码外" : rank <= 8 ? "Top8" : rank <= 12 ? "第9-12位" : rank <= 18 ? "第13-18位" : "第19-49位";
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "flex flex-wrap gap-2",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: rank && rank <= 18 ? "cyan" : "yellow",
                children: [
                    "实际特码排第 ",
                    rank ?? "-",
                    " 位 \xb7 ",
                    bandLabel
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: record.hitTop8 ? "green" : "rose",
                children: [
                    "Top8",
                    record.hitTop8 ? "中" : "未中"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: record.hitTop12 ? "green" : "rose",
                children: [
                    "Top12",
                    record.hitTop12 ? "中" : "未中"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: record.hitTop18 ? "green" : "rose",
                children: [
                    "Top18",
                    record.hitTop18 ? "中" : "未中"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: record.hitZodiac7 ? "green" : "rose",
                children: [
                    "肖7",
                    record.hitZodiac7 ? "中" : "未中"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                tone: record.hitZodiac9 ? "green" : "rose",
                children: [
                    "肖9",
                    record.hitZodiac9 ? "中" : "未中"
                ]
            })
        ]
    });
}
function ReferenceHistoryPanel({ records, config, onDelete, onClear, onExportJson, onExportExcel, onExportWord, onExportText }) {
    const [expandedId, setExpandedId] = (0,react.useState)(records[0]?.id ?? "");
    const visibleRecords = records.slice(0, 30);
    const currentExpandedId = records.some((record)=>record.id === expandedId) ? expandedId : records[0]?.id ?? "";
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "综合推荐档案"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 max-w-3xl text-sm leading-6 text-slate-500",
                                children: "这里保存每次生成推荐时的完整快照：Top8、Top12、Top16、Top18 号码、全量49号码、生肖Top7/Top8/Top9、全量12生肖、公式数量、证据数量和后续开奖命中情况。它和上面的近10期观察不同，这里是实际保存下来的复盘记录。"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                size: "sm",
                                disabled: !records.length,
                                onClick: onExportJson,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(file_braces/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "JSON"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                size: "sm",
                                disabled: !records.length,
                                onClick: onExportExcel,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "Excel"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                size: "sm",
                                disabled: !records.length,
                                onClick: onExportWord,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(file_down/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "Word"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                size: "sm",
                                disabled: !records.length,
                                onClick: onExportText,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "文本"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                size: "sm",
                                variant: "danger",
                                disabled: !records.length,
                                onClick: onClear,
                                children: "清空记录"
                            })
                        ]
                    })
                ]
            }),
            !records.length ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-slate-500",
                children: "暂无保存记录。打开或重新生成综合参考结果后，系统会自动保存；也可以点击“保存本次推荐”手动保存。"
            }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 space-y-3",
                children: [
                    visibleRecords.map((record)=>{
                        const expanded = currentExpandedId === record.id;
                        const actualDrawLabel = record.actualSpecial ? `${record.actualNextIssue}期：${rulequant_terminal_numberWithZodiac(record.actualSpecial, config)}` : "待开奖";
                        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-4",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                            type: "button",
                                            className: "min-w-0 text-left",
                                            onClick: ()=>setExpandedId(expanded ? "" : record.id),
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                                                            tone: record.saveType === "manual" ? "cyan" : "green",
                                                            children: record.saveType === "manual" ? "手动保存" : "自动保存"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                            className: "font-semibold text-white",
                                                            children: [
                                                                record.baseIssue ?? "-",
                                                                " 期综合推荐"
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                            className: "text-xs text-slate-500",
                                                            children: [
                                                                "保存 ",
                                                                new Date(record.savedAt).toLocaleString("zh-CN", {
                                                                    hour12: false
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                    className: "mt-2 text-xs text-slate-500",
                                                    children: [
                                                        "最新开奖 ",
                                                        record.latestNumbers.map((number)=>rulequant_terminal_numberWithZodiac(number, config)).join("  "),
                                                        " \xb7 参与公式 ",
                                                        record.ruleCount,
                                                        " 条 \xb7 证据 ",
                                                        record.signalCount,
                                                        " 条 \xb7 后续开奖 ",
                                                        actualDrawLabel
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "flex flex-col gap-2 xl:items-end",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryHitSummary, {
                                                    record: record
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "flex flex-wrap gap-2 xl:justify-end",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                            size: "sm",
                                                            onClick: ()=>setExpandedId(expanded ? "" : record.id),
                                                            children: expanded ? "收起明细" : "展开明细"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                                                            size: "sm",
                                                            variant: "danger",
                                                            onClick: ()=>onDelete(record.id),
                                                            children: "删除"
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                    className: "mb-2 text-xs text-slate-500",
                                                    children: "重点号码 Top8"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                    items: record.topNumbers8,
                                                    config: config
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                    className: "mb-2 text-xs text-slate-500",
                                                    children: "生肖 Top7"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryZodiacList, {
                                                    items: record.topZodiacs7
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                expanded && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "mt-4 space-y-4 border-t border-white/[0.08] pt-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "数据来源"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mt-1 text-white",
                                                            children: record.dataSourceLabel ?? "-"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "开奖记录"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                            className: "mt-1 text-white",
                                                            children: [
                                                                record.recordCount,
                                                                " 期"
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "证据构成"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                                            className: "mt-1 text-white",
                                                            children: [
                                                                "支持 ",
                                                                record.supportSignalCount ?? 0,
                                                                " / 排除 ",
                                                                record.opposeSignalCount ?? 0
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "49码命中位置"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mt-1 text-white",
                                                            children: record.outcome?.hitNumberRank ? `实际特码排第 ${record.outcome.hitNumberRank} 位` : "待下一期开奖核对"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "grid grid-cols-1 gap-4 xl:grid-cols-4",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "Top8 号码"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                            items: record.topNumbers8,
                                                            config: config
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "Top12 号码"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                            items: record.topNumbers12,
                                                            config: config
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "Top16 号码"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                            items: record.topNumbers16,
                                                            config: config
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "Top18 号码"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                            items: record.topNumbers18,
                                                            config: config
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "生肖 Top7"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryZodiacList, {
                                                            items: record.topZodiacs7
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "生肖 Top8"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryZodiacList, {
                                                            items: record.topZodiacs8
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mb-2 text-xs text-slate-500",
                                                            children: "生肖 Top9"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryZodiacList, {
                                                            items: record.topZodiacs9
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                            className: "rounded-md border border-white/[0.08] bg-black/15 p-3",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                    className: "cursor-pointer text-sm text-slate-300",
                                                    children: "查看全量 49 号码排序"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "mt-3",
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryNumberList, {
                                                        items: record.allNumbers,
                                                        config: config
                                                    })
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                            className: "rounded-md border border-white/[0.08] bg-black/15 p-3",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                    className: "cursor-pointer text-sm text-slate-300",
                                                    children: "查看全量 12 生肖排序"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                                    className: "mt-3",
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ReferenceHistoryZodiacList, {
                                                        items: record.allZodiacs
                                                    })
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("details", {
                                            className: "rounded-md border border-white/[0.08] bg-black/15 p-3",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)("summary", {
                                                    className: "cursor-pointer text-sm text-slate-300",
                                                    children: "查看证据摘要"
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "mt-3 grid gap-2",
                                                    children: [
                                                        record.evidenceSummary.slice(0, 40).map((item, index)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                                className: "rounded-md border border-white/[0.06] bg-white/[0.025] p-2 text-xs text-slate-300",
                                                                children: [
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: item.action === "include" ? "text-emerald-200" : "text-rose-200",
                                                                        children: item.action === "include" ? "支持" : "排除"
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                        className: "ml-2 text-white",
                                                                        children: item.ruleName
                                                                    }),
                                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                                        className: "ml-2 text-slate-500",
                                                                        children: [
                                                                            item.targetType,
                                                                            "：",
                                                                            item.targets.join("、"),
                                                                            " \xb7 分 ",
                                                                            item.scoreDelta,
                                                                            " \xb7 历史 ",
                                                                            item.successRate,
                                                                            "% \xb7 近况 ",
                                                                            item.recentRate,
                                                                            "%"
                                                                        ]
                                                                    })
                                                                ]
                                                            }, `${item.ruleId}-${index}`)),
                                                        !record.evidenceSummary.length && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-xs text-slate-500",
                                                            children: "暂无证据摘要。"
                                                        }),
                                                        record.evidenceSummary.length > 40 && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-xs text-slate-500",
                                                            children: "仅展示前 40 条，完整证据请导出 JSON/Excel。"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                            className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "生成时间"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mt-1 text-white",
                                                            children: new Date(record.generatedAt).toLocaleString("zh-CN", {
                                                                hour12: false
                                                            })
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                    className: "rounded-md border border-white/[0.08] bg-black/20 p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "text-slate-500",
                                                            children: "备注"
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                                            className: "mt-1 text-white",
                                                            children: record.note ?? "-"
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }, record.id);
                    }),
                    records.length > visibleRecords.length && /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                        className: "rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-xs text-slate-500",
                        children: [
                            "已保存 ",
                            records.length,
                            " 条，页面先展示最近 ",
                            visibleRecords.length,
                            " 条；完整内容请导出 JSON 或 Excel 查看。"
                        ]
                    })
                ]
            })
        ]
    });
}
function CandidateEvidencePanel({ candidate }) {
    if (!candidate) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
            className: "p-5",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                    className: "font-semibold text-white",
                    children: "证据面板"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    className: "mt-3 text-sm text-slate-500",
                    children: "暂无候选数据。"
                })
            ]
        });
    }
    const title = isCandidateNumber(candidate) ? candidateNumberLabel(candidate) : candidate.zodiac;
    const subtitle = isCandidateNumber(candidate) ? `${candidate.zodiac} · ${candidate.color} · ${candidate.element} · ${candidate.parity} · ${candidate.size} · 尾 ${candidate.tail}` : candidate.numbers.map(candidateNumberLabel).join("、");
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "text-[22px] font-semibold leading-tight text-white",
                                children: title
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 break-words text-sm leading-6 text-slate-500",
                                children: subtitle
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Badge, {
                        className: "w-fit",
                        tone: candidate.opposeCount ? "slate" : "green",
                        children: [
                            "评分 ",
                            candidate.score
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "支持规则"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 font-mono text-[20px] text-white",
                                children: candidate.supportCount
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-3",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "text-slate-500",
                                children: "反对规则"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-1 font-mono text-[20px] text-white",
                                children: candidate.opposeCount
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-4 rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-3 text-sm leading-6 text-cyan-50",
                children: [
                    "入选原因：综合分 ",
                    candidate.score,
                    "，支持证据 ",
                    candidate.supportCount,
                    " 条，反对证据 ",
                    candidate.opposeCount,
                    " 条；证据来自最新一期公式计算和公式历史表现，仅供公式研究和参考排序。"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "mt-5 space-y-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(EvidenceList, {
                        title: "支持证据",
                        items: candidate.supportRules,
                        tone: "green"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(EvidenceList, {
                        title: "反对证据",
                        items: candidate.opposeRules,
                        tone: "rose"
                    })
                ]
            })
        ]
    });
}
function ExportTile({ icon: Icon, title, desc, action }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
        className: "p-5",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon, {
                className: "h-6 w-6 text-cyan-200"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                className: "mt-4 font-semibold text-white",
                children: title
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                className: "mt-2 min-h-10 text-sm text-slate-500",
                children: desc
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                className: "mt-5",
                onClick: action,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(download/* default */.A, {
                        className: "h-4 w-4"
                    }),
                    "导出"
                ]
            })
        ]
    });
}
function ConfigEditor({ config, updateConfig, resetSeed }) {
    const [text, setText] = (0,react.useState)("");
    const [error, setError] = (0,react.useState)("");
    const [advancedOpen, setAdvancedOpen] = (0,react.useState)(false);
    function toggleAdvancedConfig() {
        if (!advancedOpen && !text) {
            setText(JSON.stringify(config, null, 2));
        }
        setAdvancedOpen((current)=>!current);
    }
    async function saveConfig() {
        try {
            const parsed = JSON.parse(text);
            await updateConfig(parsed);
            setError("");
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : String(saveError));
        }
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_360px]",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        className: "font-semibold text-white",
                        children: "配置 JSON"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mb-4 text-sm text-slate-500",
                        children: "生肖表、波色表、五行表、段位、对冲、偏移数组都可编辑。保存前会用当前数据做一次计算校验。"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button, {
                        onClick: toggleAdvancedConfig,
                        children: advancedOpen ? "收起高级配置" : "展开高级配置"
                    }),
                    advancedOpen ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Textarea, {
                        value: text,
                        onChange: (event)=>setText(event.target.value),
                        className: "mt-4 min-h-[620px] font-mono text-xs"
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm leading-6 text-slate-400",
                        children: "高级 JSON 已默认隐藏，设置页会更快打开；只有修改生肖、波色、五行、段位、偏移等底层配置时再展开。"
                    }),
                    advancedOpen && error && /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-3 text-sm text-rose-200",
                        children: error
                    }),
                    advancedOpen && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "mt-4 flex gap-2",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                variant: "primary",
                                onClick: saveConfig,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(icons_save/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "保存配置"
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                onClick: ()=>exportJson(config, "rulequant-config.json"),
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(file_braces/* default */.A, {
                                        className: "h-4 w-4"
                                    }),
                                    "导出 JSON"
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "当前配置摘要"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 space-y-3 text-sm text-slate-300",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        children: [
                                            "生肖顺序：",
                                            config.zodiacOrder.join("、")
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        children: [
                                            "七尾偏移：",
                                            config.sevenTailOffsets.join(", ")
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        children: [
                                            "八肖序列：",
                                            config.eightZodiacPattern.join("")
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("p", {
                                        children: [
                                            "杀三肖序列：",
                                            config.killThreePattern.join("")
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Button, {
                                        onClick: ()=>void resetSeed(),
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(refresh_cw/* default */.A, {
                                                className: "h-4 w-4"
                                            }),
                                            "恢复示例数据"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: "规则理解锁定版"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 text-sm leading-6 text-slate-500",
                                children: "页面和计算逻辑都按这套口径执行；遇到文档未覆盖或样例不一致时标记待人工确认。"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "mt-4 space-y-2 text-sm text-slate-300",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "L序是原始落球顺序；D序只排序 6 个平码，特码单独保留。"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "特码永远取原始第 7 个号码，不随 D序改变。"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "杀类规则是排除；七尾、八肖、九肖是候选支持。"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "综合参考使用已启用且可计算的用户提供公式；样例未核对不拦截。"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)((link_default()), {
                                href: "/help",
                                className: "mt-4 inline-flex text-sm text-cyan-200 hover:text-cyan-100",
                                children: "查看完整规则理解"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
function RuleUnderstandingPage() {
    const items = [
        [
            "Formula Engine",
            "唯一计算入口。公式计算、杀肖、杀合、七尾、八肖、九肖、逐期明细都必须从这里出来，其他模块不能另写一套算法。"
        ],
        [
            "Signal System",
            "只负责把公式输出变成支持或排除信号，例如支持某生肖、排除某尾数、排除某波色。"
        ],
        [
            "Scoring Engine",
            "只负责把支持/排除信号映射到 1-49 号码并打分；没有任何公式证据的号码不能进入 Top 结果。"
        ],
        [
            "Aggregation",
            "只负责把 1-49 号码结果汇总成生肖 Top 7/8/9，不重新计算公式。"
        ],
        [
            "UI 展示层",
            "页面只展示同步、计算结果、证据和逐期明细；除公式编辑器草稿试算外，不在页面里自行推导结果。"
        ],
        [
            "参与计算",
            "公式主状态只有参与计算和不参与计算。来源、推荐、样例核对都是标签，不是参与门槛。"
        ],
        [
            "开奖记录结构",
            "每期必须有平1、平2、平3、平4、平5、平6、特码，共 7 个号码。"
        ],
        [
            "L序",
            "L序是原始落球顺序：平1到平6加特码。公式写 L序时，平1就是原始平1。"
        ],
        [
            "D序",
            "D序只把 6 个平码从小到大排序，特码单独保留为第 7 位。页面表格排序和公式 D序不是一回事。"
        ],
        [
            "特码",
            "特码必须单独保存。无论公式用 L序还是 D序，特码、特尾、特合、特行都取原始第 7 个号码。"
        ],
        [
            "号码属性",
            "头=十位，尾=个位，合=十位+个位，合尾=合数个位，段位按 01-49 分 7 段。"
        ],
        [
            "生肖表",
            "当前默认使用 2026 年生肖表，生肖顺序为马、蛇、龙、兔、虎、牛、鼠、猪、狗、鸡、猴、羊。"
        ],
        [
            "波色和五行",
            "波色值为红=0、蓝=1、绿=2；五行值为金=1、木=2、水=3、火=4、土=5，可在设置里校验和修改。"
        ],
        [
            "平码/平位/生肖位",
            "平三码、平四码、平3、平4 都是开奖号码本身；平3位、平4位是该号码对应生肖在固定十二生肖序里的位置：鼠1、牛2、虎3、兔4、龙5、蛇6、马7、羊8、猴9、鸡10、狗11、猪12。单独写“位/平位/定位”才算未锁定变量。"
        ],
        [
            "杀类规则",
            "杀一肖、杀一尾、杀一合、杀一头、杀一段、杀一行都是排除规则：下期没开到才算正确。"
        ],
        [
            "候选类规则",
            "七尾、八肖、九肖是候选支持规则：下期落在集合里才算正确。七尾不是杀尾。"
        ],
        [
            "时间关系",
            "默认用第 N 期计算，用第 N+1 期的特码验证；八肖管两期验证 N+1 和 N+2；期合按后三位期数计算，例如 174 期合=1+7+4=12。"
        ],
        [
            "归一化",
            "杀肖结果大于 49 减 48；杀合减 13；杀头减 5；杀段减 7；出现 0 等异常要提示。"
        ],
        [
            "待人工确认",
            "遇到单独的“位/平位/定位”、样例对不上、表值不一致、类型不明确时，不要猜，标记待人工确认。"
        ],
        [
            "公式校验",
            "每条公式应校验变量取值、计算过程、原始结果、归一化、映射结果和下一期对错判断。"
        ],
        [
            "逐期明细",
            "每条公式都要展示每期完整计算流水账：当前期、变量、过程、结果处理、下一期开奖和对错。"
        ],
        [
            "综合参考",
            "综合参考合并已启用且可计算的用户提供公式；样例未核对不拦截，计算报错、变量不确定、停用或手动退出的公式不参与。"
        ],
        [
            "自动筛选",
            "系统推荐公式和文档公式分开；推荐公式必须先看训练期、验证期、错期和逐期明细，确认后才能加入。"
        ]
    ];
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                className: "p-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Badge, {
                        tone: "cyan",
                        children: "RuleQuant 规则理解锁定版"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        className: "mt-3 text-[22px] font-semibold leading-tight text-white",
                        children: "所有计算、校验、逐期明细和综合参考都按这里执行"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                        className: "mt-2 max-w-4xl text-sm leading-6 text-slate-400",
                        children: "如果程序计算结果和 TXT 手算样例不一致，必须标红并允许人工修改公式、顺序、变量或配置后重新校验；遇到文档没有覆盖的规则，不自行猜测，标记待人工确认。"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                children: items.map(([title, body])=>/*#__PURE__*/ (0,jsx_runtime.jsxs)(panel_Panel, {
                        className: "p-5",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                className: "font-semibold text-white",
                                children: title
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                className: "mt-2 text-sm leading-6 text-slate-400",
                                children: body
                            })
                        ]
                    }, title))
            })
        ]
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HelpContent() {
    const items = [
        [
            "L序是什么",
            "落球顺序：n1,n2,n3,n4,n5,n6,special，对应 L1-L7。"
        ],
        [
            "D序是什么",
            "只把 6 个平码按大小排序得到 D1-D6，D7/特码仍然是原始特码。"
        ],
        [
            "平位和特码",
            "平1-平7 会按规则的 L/D 模式取值；特码永远等于 special。"
        ],
        [
            "平3位和平三码区别",
            "平三码、平四码、平3、平4 是开奖号码本身；平3位、平4位 是该号码生肖在固定十二生肖序中的位置，鼠1到猪12。"
        ],
        [
            "头尾合合尾",
            "头为十位，尾为个位，合为号码各位相加，合尾为合数个位。"
        ],
        [
            "段位",
            "01-07 为 1段，08-14 为 2段，依此到 43-49 为 7段。"
        ],
        [
            "波色值",
            "红=0，蓝=1，绿=2，配置中心可编辑。"
        ],
        [
            "五行值",
            "金=1，木=2，水=3，火=4，土=5，配置中心可编辑。"
        ],
        [
            "杀肖/杀合/杀尾/杀段",
            "用第 N 期公式输出要排除的属性，再用第 N+1 期特码属性验证是否避开。"
        ],
        [
            "七尾",
            "公式得到 baseTail 后，按 [-3,-2,-1,0,+1,+2,+4] 生成 7 个尾数集合。"
        ],
        [
            "八肖/九肖",
            "八肖是生肖集合命中验证；杀三肖可反向得到九肖候选。"
        ],
        [
            "导入数据",
            "进入数据导入页，粘贴 CSV/TXT 或选择 Excel，先预览再写入本地库。"
        ],
        [
            "新增规则",
            "规则管理页填写类型、序列、公式、归一化、目标后保存。"
        ],
        [
            "运行回测",
            "回测中心会实时基于启用规则运行，并展示每期过程。"
        ],
        [
            "样例校验",
            "录入 TXT 手算样例的 raw、归一、映射和验证结果，不一致会标红。"
        ],
        [
            "备份配置",
            "配置中心或导出报告页可导出规则库、配置和回测结果。"
        ]
    ];
    return /*#__PURE__*/ _jsx("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
        children: items.map(([title, body])=>/*#__PURE__*/ _jsxs(Panel, {
                className: "p-5",
                children: [
                    /*#__PURE__*/ _jsx("h3", {
                        className: "font-semibold text-white",
                        children: title
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: "mt-2 text-sm leading-6 text-slate-400",
                        children: body
                    })
                ]
            }, title))
    });
}


/***/ }),

/***/ 4057:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 2422));


/***/ }),

/***/ 7615:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 9972:
/***/ (() => {

/* (ignored) */

/***/ })

}]);