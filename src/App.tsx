import React from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";

import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/slice";

import { RenderRoutes } from "./routes";

function App() {
  // 从redux中读取当前语言环境
  const lang = useAppSelector(selectLang);
  // 内部通过context通信，可以将所有后代antd的组件的语言一键修改
  // 通过修改locale，指定不同的语言包就能实现
  // 语言包直接使用antd提供的即可
  return <ConfigProvider locale={lang === "zh_CN" ? zhCN : enUS}>{RenderRoutes()}</ConfigProvider>;
}

export default App;
