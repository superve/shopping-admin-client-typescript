
declare module '*.vue' {
  import { DefineComponent, ComponentOptions } from 'vue'
  // const defineComponent: DefineComponent
  const componentOptions: ComponentOptions
  export default componentOptions
}