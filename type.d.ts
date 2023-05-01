export interface IChat {
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  question?: string
  answer?: string
}
