(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[558],{

/***/ 2748:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ createLucideIcon)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2030);
;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
 //# sourceMappingURL=mergeClasses.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
 //# sourceMappingURL=toKebabCase.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
 //# sourceMappingURL=toCamelCase.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const toPascalCase = (string)=>{
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
 //# sourceMappingURL=toPascalCase.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/defaultAttributes.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
 //# sourceMappingURL=defaultAttributes.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
 //# sourceMappingURL=hasA11yProp.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/context.mjs
/* __next_internal_client_entry_do_not_use__ LucideProvider,useLucideContext auto */ 
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const LucideContext = /*#__PURE__*/ (0,react.createContext)({});
function LucideProvider({ children, size, color, strokeWidth, absoluteStrokeWidth, className }) {
    const value = useMemo(()=>({
            size,
            color,
            strokeWidth,
            absoluteStrokeWidth,
            className
        }), [
        size,
        color,
        strokeWidth,
        absoluteStrokeWidth,
        className
    ]);
    return /*#__PURE__*/ createElement(LucideContext.Provider, {
        value
    }, children);
}
const useLucideContext = ()=>(0,react.useContext)(LucideContext);
 //# sourceMappingURL=context.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/Icon.mjs
/* __next_internal_client_entry_do_not_use__ default auto */ 
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 




const Icon = /*#__PURE__*/ (0,react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>{
    const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return /*#__PURE__*/ (0,react.createElement)("svg", {
        ref,
        ...defaultAttributes,
        width: size ?? contextSize ?? defaultAttributes.width,
        height: size ?? contextSize ?? defaultAttributes.height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: mergeClasses("lucide", contextClass, className),
        ...!children && !hasA11yProp(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>/*#__PURE__*/ (0,react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
 //# sourceMappingURL=Icon.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 




const createLucideIcon = (iconName, iconNode)=>{
    const Component = /*#__PURE__*/ (0,react.forwardRef)(({ className, ...props }, ref)=>/*#__PURE__*/ (0,react.createElement)(Icon, {
            ref,
            iconNode,
            className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = toPascalCase(iconName);
    return Component;
};
 //# sourceMappingURL=createLucideIcon.mjs.map


/***/ }),

/***/ 3452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PrivateAccessGate: () => (/* binding */ PrivateAccessGate)
});

// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5102);
// EXTERNAL MODULE: ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/createLucideIcon.mjs + 8 modules
var createLucideIcon = __webpack_require__(2748);
;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/shield-check.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ],
    [
        "path",
        {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }
    ]
];
const ShieldCheck = (0,createLucideIcon/* default */.A)("shield-check", __iconNode);
 //# sourceMappingURL=shield-check.mjs.map

;// ./node_modules/.pnpm/lucide-react@1.21.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/lock-keyhole.mjs
/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const lock_keyhole_iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "16",
            r: "1",
            key: "1au0dj"
        }
    ],
    [
        "rect",
        {
            x: "3",
            y: "10",
            width: "18",
            height: "12",
            rx: "2",
            key: "6s8ecr"
        }
    ],
    [
        "path",
        {
            d: "M7 10V7a5 5 0 0 1 10 0v3",
            key: "1pqi11"
        }
    ]
];
const LockKeyhole = (0,createLucideIcon/* default */.A)("lock-keyhole", lock_keyhole_iconNode);
 //# sourceMappingURL=lock-keyhole.mjs.map

// EXTERNAL MODULE: ./node_modules/.pnpm/next@16.2.9_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2030);
;// ./src/lib/security/private-access.ts
/* provided dependency */ var process = __webpack_require__(9730);
const RULEQUANT_ACCESS_STORAGE_KEY = "rulequant:privateAccessToken";
const RULEQUANT_ACCESS_PARAM_NAMES = [
    "rq",
    "access",
    "invite"
];
const RULEQUANT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_RULEQUANT_ACCESS_TOKEN?.trim() || "rq2026-friends-7kp9-mx42-qt88";
function normalizeAccessToken(value) {
    return String(value ?? "").trim();
}
function isValidAccessToken(value) {
    return normalizeAccessToken(value) === RULEQUANT_ACCESS_TOKEN;
}

;// ./src/components/private-access-gate.tsx
/* provided dependency */ var private_access_gate_process = __webpack_require__(9730);
/* __next_internal_client_entry_do_not_use__ PrivateAccessGate auto */ 



function shouldBypassForLocalDevelopment() {
    if (false) {}
    if (private_access_gate_process.env.NEXT_PUBLIC_RULEQUANT_ACCESS_GATE === "off") return true;
    const localHostnames = new Set([
        "localhost",
        "127.0.0.1",
        "::1"
    ]);
    return localHostnames.has(window.location.hostname) && private_access_gate_process.env.NEXT_PUBLIC_RULEQUANT_LOCAL_GATE !== "on";
}
function readTokenFromUrl() {
    if (false) {}
    const url = new URL(window.location.href);
    for (const key of RULEQUANT_ACCESS_PARAM_NAMES){
        const queryValue = url.searchParams.get(key);
        if (queryValue) return queryValue;
    }
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    for (const key of RULEQUANT_ACCESS_PARAM_NAMES){
        const hashValue = hashParams.get(key);
        if (hashValue) return hashValue;
    }
    return "";
}
function removeTokenFromUrl() {
    if (false) {}
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of RULEQUANT_ACCESS_PARAM_NAMES){
        if (url.searchParams.has(key)) {
            url.searchParams.delete(key);
            changed = true;
        }
    }
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
        const hashParams = new URLSearchParams(hash);
        for (const key of RULEQUANT_ACCESS_PARAM_NAMES){
            if (hashParams.has(key)) {
                hashParams.delete(key);
                changed = true;
            }
        }
        const nextHash = hashParams.toString();
        url.hash = nextHash ? `#${nextHash}` : "";
    }
    if (changed) {
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
}
function PrivateAccessScreen({ checking }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("main", {
        className: "min-h-screen overflow-hidden bg-[#04070b] text-slate-100",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(124,58,237,0.22),transparent_32%),linear-gradient(135deg,rgba(8,47,73,0.34),rgba(2,6,23,0.96)_55%)]"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("section", {
                className: "relative mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-10",
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "w-full rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-9",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-200/25 bg-cyan-300/10 text-cyan-100",
                            children: checking ? /*#__PURE__*/ (0,jsx_runtime.jsx)(ShieldCheck, {
                                className: "h-6 w-6"
                            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(LockKeyhole, {
                                className: "h-6 w-6"
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "text-sm font-medium text-cyan-200",
                            children: "RuleQuant 私密入口"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("h1", {
                            className: "mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl",
                            children: checking ? "正在检查访问入口" : "请使用专用链接打开"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                            className: "mt-4 max-w-2xl text-base leading-8 text-slate-300",
                            children: "这个页面不做公开入口展示，也不允许搜索引擎收录。请使用创建者发你的专用链接打开一次，之后同一台设备会自动记住访问权限。"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "mt-7 rounded-md border border-cyan-200/15 bg-cyan-300/[0.08] p-4 text-sm leading-7 text-cyan-50",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "font-medium",
                                    children: "说明"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                    className: "mt-1 text-cyan-100/85",
                                    children: "这是轻量私密分享，不是账号密码系统。真正需要强权限时，后续再加登录和数据库权限控制。"
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}
function PrivateAccessGate({ children }) {
    const [gateState, setGateState] = (0,react.useState)("checking");
    (0,react.useEffect)(()=>{
        let nextGateState = "blocked";
        if (shouldBypassForLocalDevelopment()) {
            nextGateState = "granted";
        } else {
            const tokenFromUrl = readTokenFromUrl();
            if (isValidAccessToken(tokenFromUrl)) {
                window.localStorage.setItem(RULEQUANT_ACCESS_STORAGE_KEY, RULEQUANT_ACCESS_TOKEN);
                removeTokenFromUrl();
                nextGateState = "granted";
            } else {
                const storedToken = window.localStorage.getItem(RULEQUANT_ACCESS_STORAGE_KEY);
                nextGateState = isValidAccessToken(storedToken) ? "granted" : "blocked";
            }
        }
        const timer = window.setTimeout(()=>setGateState(nextGateState), 0);
        return ()=>window.clearTimeout(timer);
    }, []);
    if (gateState === "granted") return /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
        children: children
    });
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(PrivateAccessScreen, {
        checking: gateState === "checking"
    });
}


/***/ }),

/***/ 6595:
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 7473:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 6595, 23));
;
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 3452));


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [186,147,204,358], () => (__webpack_exec__(7473)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);