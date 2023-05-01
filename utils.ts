import { useOpenAI } from "libs/openai"
import { ChatCompletionRequestMessage } from "openai"
import { Edge, Node } from "reactflow"
import { IChat } from "type"

type IMessages = ChatCompletionRequestMessage

export const nodeChainTransformer = (
  nodes: Node<IChat>[],
  edges: Edge[],
  targetNodeId: string
): IMessages[] => {
  const chain = []
  let currentNode = nodes.find((node) => node.id === targetNodeId)
  while (currentNode) {
    const id = currentNode.id
    const { question, answer } = currentNode.data
    if (answer !== undefined) {
      chain.push({
        content: answer,
        role: "assistant" as ChatCompletionRequestMessage["role"],
      })
    }
    if (question !== undefined) {
      chain.push({
        content: question,
        role: "user" as ChatCompletionRequestMessage["role"],
      })
    }
    const edge = edges.find((edge) => edge.target === currentNode?.id)
    if (edge) {
      currentNode = nodes.find((node) => node.id === edge.source)
    } else {
      currentNode = undefined
    }
  }
  return chain.reverse()
}

export const askAI = async (
  messages: IMessages[],
  question: string
): Promise<string> => {
  const openai = useOpenAI()

  let response = ""

  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...messages, { content: question, role: "user" }],
    })
    .then((res) => {
      response =
        res.data.choices.map((choice) => choice.message)[0]?.content ?? ""
    })
    .catch((err) => {
      console.error(err)
    })

  return response
}
