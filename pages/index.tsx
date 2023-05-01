import { useCallback, useEffect, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  Panel,
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
      if (initialState.nodes.length === 0) {
        onCreateNewNode()
      }
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
    setCenter(newNode.position.x, newNode.position.y, {
      zoom: 1.5,
      duration: 1000,
    })
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
        <Panel
          position="top-left"
          className="text-black bg-white py-[4px] px-[8px] h-fit flex flex-col gap-[5px] text-[12px]"
        >
          <p className="font-mono opacity-50">Shortcuts</p>
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <p className="font-medium">Create node</p>
              <span className="bg-white px-[4px] border-black/10 rounded-lg text-black/50 border-[2px]">
                n
              </span>
            </div>
          </div>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </main>
  )
}
