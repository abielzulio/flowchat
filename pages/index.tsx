import { useCallback, useEffect, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow"
import "reactflow/dist/style.css"

import { nanoid } from "nanoid"
import { baseChat, fitViewOptions, nodeTypes } from "reactflow.options"

export default function Main() {
  const [appInstance, setAppInstance] = useState<ReactFlowInstance>()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { getState } = useStoreApi()
  const { setViewport, setCenter } = useReactFlow()

  const appWrapper = useRef<HTMLElement>(null)

  /* Load state from localStorage */
  useEffect(() => {
    const storedState = localStorage.getItem("flowchat")

    if (!storedState) return

    const initialState = JSON.parse(storedState)

    if (initialState) {
      const { x = 0, y = 0, zoom = 1 } = initialState.viewport
      setNodes(initialState.nodes)
      setEdges(initialState.edges)
      setViewport({ x, y, zoom })
    }
  }, [])

  /* Save state to localStorage */
  useEffect(() => {
    if (appInstance) {
      const appState = appInstance.toObject()
      if (!appState) return
      localStorage.setItem("flowchat", JSON.stringify(appState))
    }
  }, [nodes, edges, appInstance])

  /* Create new chat node on "n" keydown */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      /* Prevent creating new node when typing in input */
      if (e.key === "n" && document.activeElement === document.body) {
        onCreateNewNode()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  )

  const onCreateNewNode = useCallback(() => {
    const allNodes = Array.from(getState().nodeInternals).map(
      ([, node]) => node
    )
    const latestNode = allNodes?.[allNodes?.length! - 1] ?? null
    const newNode: Node = {
      ...baseChat,
      id: nanoid(),
      position: {
        x: latestNode ? latestNode.position.x : 0,
        y: latestNode ? latestNode.position.y + latestNode.height! + 50 : 0,
      },
    }
    setNodes((nds) => nds.concat(newNode))
    setCenter(
      latestNode
        ? latestNode.position.x + latestNode.width! / 3 + 150
        : newNode.position.x + 150,
      latestNode
        ? latestNode.position.y + latestNode.height! + 100
        : newNode.position.y + 100,
      {
        zoom: 2,
        duration: 1000,
      }
    )
  }, [nodes, appInstance])

  return (
    <main className="w-screen h-screen" ref={appWrapper}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setAppInstance}
        fitView
        snapToGrid
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </main>
  )
}
