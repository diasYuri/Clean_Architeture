export interface TokenGeneration{
  generation: (id: string) => Promise<string>
}
