"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[686],{9686:(t,e,o)=>{let a;function r(){return a??=Promise.all([o.e(969),o.e(744)]).then(o.bind(o,2151))}function p(t,e){let o=URL.createObjectURL(t),a=document.createElement("a");a.href=o,a.download=e,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(o)}function s(t,e){p(new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),e)}o.r(e),o.d(e,{buildRuleLibraryWordHtml:()=>i,exportBacktestExcel:()=>m,exportCandidatePoolExcel:()=>f,exportCandidatePoolHtml:()=>_,exportDrawsCsv:()=>c,exportHtmlReport:()=>j,exportJson:()=>s,exportReferenceHistoryExcel:()=>v,exportReferenceHistoryText:()=>k,exportReferenceHistoryWord:()=>N,exportRuleLibraryWord:()=>d,exportSampleReport:()=>b,exportWorkbook:()=>h});let n={user_provided:"用户提供公式",manual:"人工新增公式",system_recommended:"系统推荐公式",txt_import:"TXT 导入公式",copied:"复制公式",example:"示例公式"},l={kill_zodiac:"杀一肖",include_zodiac:"选生肖",kill_color:"杀一波",include_color:"参考波色",kill_parity:"杀单双",include_parity:"参考单双",kill_size:"杀大小",include_size:"参考大小",kill_sum:"杀一合",kill_tail:"杀一尾",kill_head:"杀一头",kill_half_head:"杀半头",kill_door:"杀一门",kill_element:"杀一行",kill_segment:"杀一段",seven_tail:"七尾",six_zodiac:"取六肖",eight_zodiac:"八肖",eight_zodiac_two_period:"八肖管两期",nine_zodiac:"九肖",kill_three_as_nine:"杀三肖 / 九肖",custom_set:"自定义集合"};function i(t){let e=new Date().toLocaleString("zh-CN",{hour12:!1}),o=t.filter(t=>t.enabled).length,a=t.filter(t=>t.enabled&&!1!==t.participatesInReference).length,r=t.filter(t=>"manual"===t.sourceType).length,p=t.filter(t=>"txt_import"===t.sourceType).length,s=t.filter(t=>"system_recommended"===t.sourceType).length,i=t.map((t,e)=>`
    <tr>
      <td>${e+1}</td>
      <td>${z(t.name)}</td>
      <td>${z(l[t.category]??t.category)}</td>
      <td>${z(t.orderMode)}序</td>
      <td>${z(n[t.sourceType??"user_provided"]??t.sourceType??"用户提供公式")}</td>
      <td>${t.enabled?"启用":"停用"}</td>
      <td>${!1!==t.participatesInReference?"参与":"不参与"}</td>
    </tr>`).join(""),d=t.map((t,e)=>{let o=n[t.sourceType??"user_provided"]??t.sourceType??"用户提供公式",a=t.positionPattern?.length?t.positionPattern.join(" → "):"无固定取位循环",r=t.examples?.length?t.examples.map(t=>`<li>${z(t)}</li>`).join(""):"<li>暂无手算样例</li>";return`
      <section class="rule-card">
        <div class="rule-heading">
          <span class="rule-index">${String(e+1).padStart(2,"0")}</span>
          <div><h2>${z(t.name)}</h2><p>${z(l[t.category]??t.category)} \xb7 ${z(t.orderMode)}序 \xb7 ${z(o)}</p></div>
        </div>
        <div class="status-row">
          <span>${t.enabled?"已启用":"已停用"}</span>
          <span>${!1!==t.participatesInReference?"参与综合参考":"不参与综合参考"}</span>
          <span>${!1===t.canCompute?"计算异常":"可计算"}</span>
          <span>${z(t.verifyStatus??"unchecked")}</span>
        </div>
        <h3>公式</h3>
        <div class="formula">${z(t.formula)}</div>
        <table class="property-table"><tbody>
          <tr><th>归一化</th><td>${z(t.normalizer||"auto")}</td><th>目标</th><td>${z(t.target)}</td></tr>
          <tr><th>取位循环</th><td colspan="3">${z(a)}</td></tr>
          <tr><th>锚点期号</th><td>${z(t.anchorIssue??"无")}</td><th>锚点位置</th><td>${z(t.anchorPatternIndex??"无")}</td></tr>
          <tr><th>管期</th><td>${t.periodSpan||1}期</td><th>验证偏移</th><td>${t.verifyOffset||1}期</td></tr>
          <tr><th>来源文件</th><td colspan="3">${z(t.sourceFile||t.origin||"未记录")}</td></tr>
        </tbody></table>
        <h3>规则说明</h3><p class="description">${z(t.description||"暂无说明")}</p>
        <h3>样例</h3><ul>${r}</ul>
      </section>`}).join("");return`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>RuleQuant 全部公式</title>
<style>
  @page { size: A4; margin: 16mm; }
  body { margin: 0; color: #172033; background: #fff; font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif; font-size: 11pt; line-height: 1.65; }
  h1 { margin: 0; color: #10213d; font-size: 25pt; letter-spacing: 0; }
  h2 { margin: 0; color: #10213d; font-size: 16pt; }
  h3 { margin: 13px 0 5px; color: #36506f; font-size: 10.5pt; }
  .cover { padding: 12px 0 22px; border-bottom: 3px solid #3e70c9; }
  .cover p { margin: 6px 0 0; color: #65758d; }
  .notice { margin: 16px 0; padding: 10px 13px; border-left: 4px solid #2aa7a0; background: #edf9f8; color: #315b5a; }
  .summary { width: 100%; margin: 16px 0 22px; border-collapse: separate; border-spacing: 7px; }
  .summary td { width: 16.66%; padding: 10px; border: 1px solid #cfd9e7; background: #f5f8fc; text-align: center; }
  .summary strong { display: block; color: #17345d; font-size: 18pt; }.summary span { color: #68788f; font-size: 9pt; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 6px 8px; border: 1px solid #cfd9e7; text-align: left; vertical-align: top; }
  thead th { background: #17345d; color: #fff; font-weight: 600; }
  .overview { font-size: 9pt; }.overview tr:nth-child(even) td { background: #f7f9fc; }
  .section-title { margin: 26px 0 10px; color: #17345d; font-size: 18pt; page-break-after: avoid; }
  .rule-card { margin: 0 0 18px; padding: 14px; border: 1px solid #c9d5e5; border-radius: 8px; page-break-inside: avoid; }
  .rule-heading { display: table; width: 100%; }.rule-heading > * { display: table-cell; vertical-align: middle; }
  .rule-index { width: 42px; color: #3e70c9; font-family: Consolas, monospace; font-size: 17pt; font-weight: 700; }
  .rule-heading p { margin: 2px 0 0; color: #728198; font-size: 9.5pt; }
  .status-row { margin: 10px 0; }.status-row span { display: inline-block; margin: 0 5px 5px 0; padding: 3px 8px; border: 1px solid #b8d9d5; background: #eef9f7; color: #256d66; font-size: 8.5pt; }
  .formula { padding: 10px 12px; border: 1px solid #bfcce0; background: #f2f6fc; color: #0c5e78; font-family: Consolas, "Microsoft YaHei", monospace; font-size: 10.5pt; font-weight: 700; word-break: break-all; }
  .property-table { font-size: 9pt; }.property-table th { width: 82px; background: #f1f5fa; color: #52647c; }.property-table td { color: #25364e; }
  .description, ul { margin: 0; color: #42536b; } ul { padding-left: 20px; }
  .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #d7e0ec; color: #7d8999; font-size: 8.5pt; }
</style></head><body>
  <header class="cover"><h1>RuleQuant 全部公式</h1><p>统一公式库完整备查文档 \xb7 导出时间：${z(e)}</p></header>
  <div class="notice">本文件包含导出设备当前已保存的全部公式，包括内置、人工新增、TXT 导入、系统推荐后加入和复制公式。仅用于历史公式研究与规则核对。</div>
  <table class="summary"><tr><td><strong>${t.length}</strong><span>全部公式</span></td><td><strong>${o}</strong><span>已启用</span></td><td><strong>${a}</strong><span>参与参考</span></td><td><strong>${r}</strong><span>人工新增</span></td><td><strong>${p}</strong><span>TXT导入</span></td><td><strong>${s}</strong><span>系统推荐</span></td></tr></table>
  <h2 class="section-title">公式总览</h2>
  <table class="overview"><thead><tr><th>序号</th><th>公式名称</th><th>类型</th><th>序列</th><th>来源</th><th>状态</th><th>综合参考</th></tr></thead><tbody>${i}</tbody></table>
  <h2 class="section-title">逐条公式详情</h2>${d||"<p>当前公式库为空。</p>"}
  <p class="footer">RuleQuant 公式库导出 \xb7 文档中的状态以导出时设备保存内容为准。</p>
</body></html>`}function d(t){let e=i(t),o=new Date().toISOString().slice(0,10).replace(/-/g,"");p(new Blob([`\ufeff${e}`],{type:"application/msword;charset=utf-8"}),`RuleQuant-全部公式-${t.length}条-${o}.doc`)}async function c(t){let e=await r(),o=e.utils.json_to_sheet(t),a=e.utils.sheet_to_csv(o);p(new Blob([`\ufeff${a}`],{type:"text/csv;charset=utf-8"}),"rulequant-draws.csv")}function u(t){return null==t?0:Array.isArray(t)?t.reduce((t,e)=>t+u(e)+2,0):"object"==typeof t?JSON.stringify(t).length:String(t).replace(/\r?\n/g," ").length}async function h(t,e){let o=await r(),a=o.utils.book_new();Object.entries(t).forEach(([t,e])=>{let r,p;o.utils.book_append_sheet(a,(r=o.utils.json_to_sheet(e),p=Array.from(e.reduce((t,e)=>(e&&"object"==typeof e&&!Array.isArray(e)&&Object.keys(e).forEach(e=>t.add(e)),t),new Set)),r["!cols"]=p.map(t=>({wch:Math.min(48,Math.max(10,e.reduce((e,o)=>Math.max(e,u(o?.[t])),u(t))+2))})),r),t.slice(0,31))}),p(new Blob([o.write(a,{bookType:"xlsx",type:"array",compression:!0})],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),e)}function m(t){h({backtest:t.ruleResults.flatMap(t=>t.details.map(t=>({rule:t.ruleName,issue:t.currentIssue,formula:t.formula,rawResult:t.rawResult,finalResult:Array.isArray(t.finalResult)?t.finalResult.join("、"):t.finalResult,mappedResult:t.mappedResult.join("、"),nextIssue:t.nextIssue,success:t.success?"通过":"失败",process:t.process.join(" | ")})))},"rulequant-backtest.xlsx")}function b(t){h({sample_check:t.map(t=>({caseId:t.caseId,ruleId:t.ruleId,issue:t.issue,passed:t.passed?"通过":"不一致",differences:t.differences.map(t=>`${t.type}: ${t.expected} -> ${t.actual}`).join(" | ")}))},"rulequant-sample-check.xlsx")}function f(t){h({top_numbers_8:t.topNumbers8.map((t,e)=>({rank:e+1,number:t.number,zodiac:t.zodiac,tail:t.tail,head:t.head,sum:t.sum,element:t.element,color:t.color,score:t.score,supportCount:t.supportCount,opposeCount:t.opposeCount,supportRules:t.supportRules.map(t=>t.ruleName).join(" | "),opposeRules:t.opposeRules.map(t=>t.ruleName).join(" | ")})),top_numbers_12:t.topNumbers12.map((t,e)=>({rank:e+1,number:t.number,zodiac:t.zodiac,tail:t.tail,head:t.head,sum:t.sum,element:t.element,color:t.color,score:t.score,supportCount:t.supportCount,opposeCount:t.opposeCount,supportRules:t.supportRules.map(t=>t.ruleName).join(" | "),opposeRules:t.opposeRules.map(t=>t.ruleName).join(" | ")})),top_numbers_18:t.topNumbers18.map((t,e)=>({rank:e+1,number:t.number,zodiac:t.zodiac,tail:t.tail,head:t.head,sum:t.sum,element:t.element,color:t.color,score:t.score,supportCount:t.supportCount,opposeCount:t.opposeCount,supportRules:t.supportRules.map(t=>t.ruleName).join(" | "),opposeRules:t.opposeRules.map(t=>t.ruleName).join(" | ")})),top_zodiacs_9:t.topZodiacs9.map((t,e)=>({rank:e+1,zodiac:t.zodiac,numbers:t.numbers.map(t=>t.number).join("、"),score:t.score,supportCount:t.supportCount,opposeCount:t.opposeCount,supportRules:t.supportRules.map(t=>t.ruleName).join(" | "),opposeRules:t.opposeRules.map(t=>t.ruleName).join(" | ")})),rule_signals:t.signals.map(t=>({rule:t.ruleName,category:t.category,action:"include"===t.action?"支持":"排除",targetType:t.targetType,targets:t.targets.join("、"),weight:t.weight,successRate:t.successRate,recentRate:t.recentRate,currentStreak:t.currentStreak,formula:t.formula,process:t.process.join(" | ")}))},"rulequant-candidate-pool.xlsx")}function g(t){return String(t).padStart(2,"0")}function $(t){return t.map(t=>`${g(t.number)} ${t.zodiac}`).join("、")}function x(t){return t.map(t=>`${t.zodiac}(${t.numbers.map(t=>g(t.number)).join("、")})`).join("、")}function y(t){return(t??[]).slice(0,6).map(t=>`${t.ruleName}(${"include"===t.action?"支持":"排除"} ${t.scoreDelta>0?"+":""}${t.scoreDelta})`).join(" | ")}function T(t){return void 0===t?"待开奖":t?"命中":"未中"}function R(t,e){return t.flatMap(t=>t[e].map((o,a)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,分组:"topNumbers8"===e?"Top8":"topNumbers12"===e?"Top12":"topNumbers16"===e?"Top16":"Top18",排名:o.rank??a+1,号码:g(o.number),生肖:o.zodiac,分数:o.score,支持公式:o.supportCount,反对公式:o.opposeCount,波色:o.color??"",五行:o.element??"",尾:o.tail??"",合:o.sum??"",段:o.segment??"",下期特码:t.actualSpecial?g(t.actualSpecial):"待开奖",是否命中:void 0===t.actualSpecial?"待开奖":o.number===t.actualSpecial?"命中":"",支持规则:o.supportRuleNames?.join(" | ")??"",反对规则:o.opposeRuleNames?.join(" | ")??"",支持证据:y(o.supportEvidence),反对证据:y(o.opposeEvidence)})))}function v(t){h({综合推荐总览:t.map(t=>({保存时间:t.savedAt,生成时间:t.generatedAt,使用期号:t.baseIssue??"-",最新开奖:t.latestNumbers.map(g).join("、"),数据来源:t.dataSourceLabel??"-",记录期数:t.recordCount,公式数量:t.ruleCount,证据数量:t.signalCount,支持证据:t.supportSignalCount??0,排除证据:t.opposeSignalCount??0,命中排名:t.outcome?.hitNumberRank??"",命中分区:t.outcome?.hitBand??"",下期开奖期号:t.actualNextIssue??"待开奖",下期特码:t.actualSpecial?`${g(t.actualSpecial)} ${t.actualZodiac??""}`:"待开奖",Top8结果:T(t.hitTop8),Top12结果:T(t.hitTop12),Top18结果:T(t.hitTop18),生肖Top7结果:T(t.hitZodiac7),生肖Top9结果:T(t.hitZodiac9),Top8号码:$(t.topNumbers8),Top12号码:$(t.topNumbers12),Top16号码:$(t.topNumbers16),Top18号码:$(t.topNumbers18),生肖Top7:x(t.topZodiacs7),生肖Top8:x(t.topZodiacs8),生肖Top9:x(t.topZodiacs9),备注:t.note??""})),Top号码:[...R(t,"topNumbers8"),...R(t,"topNumbers12"),...R(t,"topNumbers16"),...R(t,"topNumbers18")],全量号码49:t.flatMap(t=>(t.allNumbers??t.topNumbers18).map((e,o)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,排名:e.rank??o+1,号码:g(e.number),生肖:e.zodiac,分数:e.score,支持公式:e.supportCount,反对公式:e.opposeCount,是否Top8:e.inTop8?"是":"",是否Top12:e.inTop12?"是":"",是否Top16:e.inTop16?"是":"",是否Top18:e.inTop18?"是":"",下期特码:t.actualSpecial?g(t.actualSpecial):"待开奖",是否命中:void 0===t.actualSpecial?"待开奖":e.number===t.actualSpecial?"命中":"",波色:e.color??"",五行:e.element??"",尾:e.tail??"",合:e.sum??"",段:e.segment??"",支持规则:e.supportRuleNames?.join(" | ")??"",反对规则:e.opposeRuleNames?.join(" | ")??"",支持证据:y(e.supportEvidence),反对证据:y(e.opposeEvidence)}))),生肖排名:t.flatMap(t=>(t.allZodiacs??t.topZodiacs9).map((e,o)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,分组:e.inTop7?"Top7/Top8/Top9":e.inTop8?"Top8/Top9":e.inTop9?"Top9":"全量生肖",排名:e.rank??o+1,生肖:e.zodiac,对应号码:e.numbers.map(t=>`${g(t.number)} ${t.zodiac}`).join("、"),分数:e.score,支持公式:e.supportCount,反对公式:e.opposeCount,下期生肖:t.actualZodiac??"待开奖",是否命中:void 0===t.actualZodiac?"待开奖":e.zodiac===t.actualZodiac?"命中":"",支持规则:e.supportRuleNames?.join(" | ")??"",反对规则:e.opposeRuleNames?.join(" | ")??"",支持证据:y(e.supportEvidence),反对证据:y(e.opposeEvidence)}))),证据摘要:t.flatMap(t=>[...(t.evidenceSummary??[]).map((e,o)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,对象类型:"全局摘要",对象:"-",排名:"",序号:o+1,规则:e.ruleName,动作:"include"===e.action?"支持":"排除",目标类型:e.targetType,目标:e.targets.join("、"),分值:e.scoreDelta,权重:e.weight,历史成功率:e.successRate,最近表现:e.recentRate,当前连对:e.currentStreak,当前连错:e.wrongStreak??0,来源:e.sourceType??"user_provided",公式:e.formula??"",过程摘要:e.process?.join(" | ")??""})),...t.topNumbers18.flatMap(e=>[...e.supportEvidence??[],...e.opposeEvidence??[]].map((o,a)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,对象类型:"号码",对象:`${g(e.number)} ${e.zodiac}`,排名:e.rank,序号:a+1,规则:o.ruleName,动作:"include"===o.action?"支持":"排除",目标类型:o.targetType,目标:o.targets.join("、"),分值:o.scoreDelta,权重:o.weight,历史成功率:o.successRate,最近表现:o.recentRate,当前连对:o.currentStreak,当前连错:o.wrongStreak??0,来源:o.sourceType??"user_provided",公式:o.formula??"",过程摘要:o.process?.join(" | ")??""}))),...t.topZodiacs9.flatMap(e=>[...e.supportEvidence??[],...e.opposeEvidence??[]].map((o,a)=>({使用期号:t.baseIssue??"-",保存时间:t.savedAt,对象类型:"生肖",对象:e.zodiac,排名:e.rank,序号:a+1,规则:o.ruleName,动作:"include"===o.action?"支持":"排除",目标类型:o.targetType,目标:o.targets.join("、"),分值:o.scoreDelta,权重:o.weight,历史成功率:o.successRate,最近表现:o.recentRate,当前连对:o.currentStreak,当前连错:o.wrongStreak??0,来源:o.sourceType??"user_provided",公式:o.formula??"",过程摘要:o.process?.join(" | ")??""})))])},"rulequant-reference-history.xlsx")}function k(t){let e=t.flatMap(t=>[`【${t.baseIssue??"-"}期综合推荐记录】`,`保存时间：${t.savedAt}`,`生成时间：${t.generatedAt}`,`最新开奖：${t.latestNumbers.map(g).join("、")}`,`参与公式：${t.ruleCount} 条；证据：${t.signalCount} 条；数据来源：${t.dataSourceLabel??"-"}`,`下期开奖：${t.actualNextIssue??"待开奖"} ${t.actualSpecial?`${g(t.actualSpecial)} ${t.actualZodiac??""}`:""}`,`Top8：${$(t.topNumbers8)}（${T(t.hitTop8)}）`,`Top12：${$(t.topNumbers12)}（${T(t.hitTop12)}）`,`Top16：${$(t.topNumbers16)}（命中排名：${t.outcome?.hitNumberRank??"待开奖"}）`,`Top18：${$(t.topNumbers18)}（${T(t.hitTop18)}）`,`生肖Top7：${x(t.topZodiacs7)}（${T(t.hitZodiac7)}）`,`生肖Top8：${x(t.topZodiacs8)}`,`生肖Top9：${x(t.topZodiacs9)}（${T(t.hitZodiac9)}）`,`全量49号码：${$(t.allNumbers??[])}`,""]);p(new Blob([`\ufeff${e.join("\r\n")}`],{type:"text/plain;charset=utf-8"}),"rulequant-reference-history.txt")}function N(t){let e=t.map(t=>{let e=t.topNumbers18.map((e,o)=>`
      <tr>
        <td>${o+1}</td>
        <td>${g(e.number)}</td>
        <td>${z(e.zodiac)}</td>
        <td>${e.score}</td>
        <td>${e.supportCount}</td>
        <td>${e.opposeCount}</td>
        <td>${t.actualSpecial===e.number?"命中":""}</td>
      </tr>`).join(""),o=t.topZodiacs9.map((e,o)=>`
      <tr>
        <td>${o+1}</td>
        <td>${z(e.zodiac)}</td>
        <td>${z(e.numbers.map(t=>`${g(t.number)} ${t.zodiac}`).join("、"))}</td>
        <td>${e.score}</td>
        <td>${t.actualZodiac===e.zodiac?"命中":""}</td>
      </tr>`).join("");return`
      <section class="record">
        <h2>${z(t.baseIssue??"-")}期综合推荐记录</h2>
        <p class="meta">保存时间：${z(t.savedAt)}　生成时间：${z(t.generatedAt)}</p>
        <p class="meta">最新开奖：${z(t.latestNumbers.map(g).join("、"))}　参与公式：${t.ruleCount} 条　证据：${t.signalCount} 条</p>
        <p class="meta">下期开奖：${z(t.actualNextIssue??"待开奖")} ${t.actualSpecial?`${g(t.actualSpecial)} ${z(t.actualZodiac??"")}`:""}</p>
        <div class="chips"><b>Top8</b> ${z($(t.topNumbers8))}</div>
        <div class="chips"><b>Top12</b> ${z($(t.topNumbers12))}</div>
        <div class="chips"><b>生肖Top7</b> ${z(x(t.topZodiacs7))}</div>
        <h3>号码 Top18 明细</h3>
        <table><thead><tr><th>排名</th><th>号码</th><th>生肖</th><th>分数</th><th>支持</th><th>反对</th><th>命中</th></tr></thead><tbody>${e}</tbody></table>
        <h3>生肖 Top9 明细</h3>
        <table><thead><tr><th>排名</th><th>生肖</th><th>对应号码</th><th>分数</th><th>命中</th></tr></thead><tbody>${o}</tbody></table>
      </section>`}).join(""),o=`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>RuleQuant 综合推荐历史记录</title>
  <style>
    body { font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; color: #111827; line-height: 1.55; padding: 28px; }
    h1 { font-size: 26px; margin: 0 0 8px; }
    h2 { font-size: 20px; margin: 24px 0 8px; color: #0f766e; }
    h3 { font-size: 15px; margin: 18px 0 8px; }
    .sub { color: #64748b; font-size: 12px; margin-bottom: 18px; }
    .meta { font-size: 12px; color: #334155; margin: 4px 0; }
    .chips { background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 6px; padding: 8px 10px; margin: 8px 0; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #0f172a; color: #fff; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    .record { page-break-inside: avoid; margin-bottom: 28px; }
  </style>
</head>
<body>
  <h1>RuleQuant 综合推荐历史记录</h1>
  <p class="sub">本报告用于公式研究和参考排序复盘，不代表一定正确。</p>
  ${e||"<p>暂无综合推荐历史记录。</p>"}
</body>
</html>`;p(new Blob([`\ufeff${o}`],{type:"application/msword;charset=utf-8"}),"rulequant-reference-history.doc")}function j(t,e,o){let a=t.ruleResults.map(t=>`<tr><td>${t.rule.name}</td><td>${t.total}</td><td>${t.success}</td><td>${t.failed}</td><td>${t.successRate}%</td><td>${t.currentStreak}</td></tr>`).join("");p(new Blob([`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>RuleQuant 回测报告</title><body style="font-family:Arial,sans-serif;background:#05070d;color:#eef;padding:32px"><h1>RuleQuant 回测报告</h1><p>规则数：${e.length}，生肖配置：${o.zodiacOrder.join("、")}</p><table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>规则</th><th>总期数</th><th>成功</th><th>失败</th><th>成功率</th><th>当前连对</th></tr></thead><tbody>${a}</tbody></table><p style="opacity:.7">仅为历史规则回测输出，不作为任何资金决策依据。</p></body></html>`],{type:"text/html;charset=utf-8"}),"rulequant-report.html")}function z(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function _(t){let e=t.topNumbers8.map((t,e)=>`<tr><td>${e+1}</td><td>${String(t.number).padStart(2,"0")}</td><td>${z(t.zodiac)}</td><td>${t.score}</td><td>${t.supportCount}</td><td>${t.opposeCount}</td><td>${z(t.supportRules.map(t=>t.ruleName).join("、"))}</td><td>${z(t.opposeRules.map(t=>t.ruleName).join("、"))}</td></tr>`).join(""),o=t.topNumbers18.map((t,e)=>`<tr><td>${e+1}</td><td>${String(t.number).padStart(2,"0")}</td><td>${z(t.zodiac)}</td><td>${t.score}</td><td>${t.supportCount}</td><td>${t.opposeCount}</td><td>${z(t.supportRules.map(t=>t.ruleName).join("、"))}</td><td>${z(t.opposeRules.map(t=>t.ruleName).join("、"))}</td></tr>`).join(""),a=t.topZodiacs9.map((t,e)=>`<tr><td>${e+1}</td><td>${z(t.zodiac)}</td><td>${t.score}</td><td>${z(t.numbers.map(t=>String(t.number).padStart(2,"0")).join("、"))}</td><td>${t.supportCount}</td><td>${t.opposeCount}</td></tr>`).join("");p(new Blob([`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>RuleQuant 规则共识候选池</title><body style="font-family:Arial,'Microsoft YaHei',sans-serif;background:#05070d;color:#eef;padding:32px"><h1>RuleQuant 规则共识候选池</h1><p>生成时间：${z(t.generatedAt)}，最新期：${z(t.latestIssue??"-")}，启用规则：${t.ruleCount}，信号：${t.signalCount}</p><h2>重点精筛号码 Top 8</h2><p>优先看这里；Top 18 只是宽参考。</p><table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>排名</th><th>号码</th><th>生肖</th><th>评分</th><th>支持</th><th>反对</th><th>支持规则</th><th>反对规则</th></tr></thead><tbody>${e}</tbody></table><h2>综合评分候选号码 Top 18</h2><table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>排名</th><th>号码</th><th>生肖</th><th>评分</th><th>支持</th><th>反对</th><th>支持规则</th><th>反对规则</th></tr></thead><tbody>${o}</tbody></table><h2>综合评分候选生肖 Top 9</h2><table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>排名</th><th>生肖</th><th>评分</th><th>号码</th><th>支持</th><th>反对</th></tr></thead><tbody>${a}</tbody></table><p style="opacity:.7">${z(t.riskNotice)}</p></body></html>`],{type:"text/html;charset=utf-8"}),"rulequant-candidate-pool.html")}}}]);