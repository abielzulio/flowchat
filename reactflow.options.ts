import { FitViewOptions, Node, NodeTypes } from "reactflow"
import "reactflow/dist/style.css"

import Chat from "components/Chat"
import type { IChat } from "type"

export const baseChat: Node<IChat> = {
  id: "",
  data: { question: "", answer: "" },
  dragHandle: ".drag-handle",
  selected: false,
  type: "chat",
  position: { x: 0, y: 0 },
}

export const nodeTypes: NodeTypes = {
  chat: Chat,
}

export const fitViewOptions: FitViewOptions = {
  padding: 10,
  minZoom: 1,
  maxZoom: 2,
}
