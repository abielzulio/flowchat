import { nanoid } from "nanoid"
import { memo, useCallback, useState } from "react"
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodeId,
  useReactFlow,
  useStoreApi,
} from "reactflow"
import { baseChat } from "reactflow.options"
import { IChat } from "type"
import { askAI, nodeChainTransformer } from "utils"

const Chat = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps<IChat>) => {
  const [question, setQuestion] = useState<string>("")
  const appInstance = useReactFlow()
  const nodeId = useNodeId()
  const { getState } = useStoreApi()
  const { nodeInternals } = getState()
  const allNodes = Array.from(nodeInternals).map(([, node]) => node)

  const isFirstNode = allNodes[0].id === nodeId

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    if (!nodeId) return
    const messages = nodeChainTransformer(
      allNodes,
      appInstance.getEdges(),
      nodeId
    )
    console.log(messages)
    const answer = await askAI(messages, question)
    if (question === "") return
    appInstance.setNodes((prevNodes) => {
      const newNodes = [...prevNodes]
      const nodeIndex = newNodes.findIndex((node) => node.id === nodeId)
      newNodes[nodeIndex].data = {
        ...newNodes[nodeIndex].data,
        question,
        answer,
      }
      return newNodes
    })
  }

  const onFocusNode = useCallback(() => {
    if (!nodeId) return
    if (allNodes.length > 0) {
      const node = allNodes.find((node) => node.id === nodeId)

      if (!node) return

      const x = node.position.x + node.width! / 2
      const y = node.position.y + node.height!
      const zoom = 1.85

      appInstance.setCenter(x, y, { zoom, duration: 1000 })
    }
  }, [])
  const onDeleteNode = useCallback(() => {
    if (!nodeId) return
    const node = allNodes.find((node) => node.id === nodeId)
    if (!node) return
    const edges = appInstance.getEdges()
    const connectedEdges = edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    )

    appInstance.deleteElements({ nodes: [node], edges: connectedEdges })
  }, [appInstance])

  const onCreateNewNode = useCallback(() => {
    if (!nodeId) return
    const selectedNode = allNodes?.find((node) => node.id === nodeId)
    if (!selectedNode) return
    const newNode: Node<IChat> = {
      ...baseChat,
      id: nanoid(),
      position: {
        x: 100,
        y: 0,
      },
    }
    appInstance.setNodes((nds) => nds.concat(newNode))

    if (selectedNode) {
      appInstance.setEdges((els) =>
        els.concat({
          id: `reactflow__edge-${nodeId}-${newNode.id}`,
          source: nodeId,
          target: newNode.id,
        })
      )
    }
  }, [appInstance])

  return (
    <>
      {!isFirstNode && (
        <Handle
          type="target"
          position={targetPosition}
          isConnectable={isConnectable}
        />
      )}
      <div className="bg-gray-300 w-full px-[12px] py-[10px] font-mono text-[10px] text-black/50 drag-handle flex items-center justify-between">
        #{allNodes.findIndex((node) => node.id === nodeId) + 1}
        <div className="flex gap-[10px] items-center">
          <button type="button" onClick={() => onCreateNewNode()}>
            add
          </button>
          <button type="button" onClick={() => onDeleteNode()}>
            <TrashIcon size={12} />
          </button>
        </div>
      </div>
      <div className="flex gap-[4px] flex-col w-[300px] h-fit max-h-[300px] bg-white text-black text-[12px] cursor-default">
        <form onSubmit={onSubmit} className="w-full">
          <input
            type="text"
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What's your question?"
            className="text-[12px] outline-transparent border-[0px] w-full"
          />
        </form>
        <p className="overflow-scroll px-[12px] pt-[12px]">{data.answer}</p>
      </div>
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  )
}

export default memo(Chat)
