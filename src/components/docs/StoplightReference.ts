import { defineComponent, h } from 'vue'

// Only imported when the REST reference tab is opened.
import '@stoplight/elements/web-components.min.js'
import '@stoplight/elements/styles.min.css'

export default defineComponent({
  name: 'StoplightReference',
  props: {
    specUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('elements-api', {
        class: 'stoplight-reference',
        apiDescriptionUrl: props.specUrl,
        router: 'memory',
        layout: 'responsive',
        hideSchemas: true,
        hideExport: true,
        hideTryIt: false,
        hideTryItPanel: false,
        hideInternal: true,
        tryItCredentialsPolicy: 'omit',
      })
  },
})
