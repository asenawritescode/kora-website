export function SdkSection() {
  return (
    <section id="sdks" className="mb-16 scroll-mt-20">
      <div className="border-b border-outline-variant pb-4 mb-6">
        <h2 className="text-[20px] leading-[28px] font-semibold text-black mb-1 tracking-[-0.02em]">
          SDKs &amp; Tools
        </h2>
        <p className="text-sm text-[#5d5f5f]">
          Build tooling and extensions with first-class Go and TypeScript SDKs.
        </p>
      </div>

      <div className="space-y-8">
        {/* Go SDK */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">Go SDK</h3>
          <p className="text-sm text-[#5d5f5f] mb-2">
            Zero-dependency Go module for building tooling, the Kora Cloud control plane,
            and custom providers. Import only the types you need.
          </p>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto">
{`import "github.com/asenawritescode/kora/sdk"

// Implement a custom provider
type myProvider struct{}

func (myProvider) GetDoc(doctype, name string) (map[string]any, error) {
    // your implementation
}
func (myProvider) GetSecret(key string) (string, error) {
    return os.Getenv(key), nil
}

// Use it with the script runner
runner.Execute(ctx, sdk.ExecuteRequest{
    Provider: myProvider{},
    Script:   scriptSource,
})`}
          </pre>
        </div>

        {/* TypeScript SDK */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">TypeScript SDK</h3>
          <p className="text-sm text-[#5d5f5f] mb-2">
            Typed client for extension authors. Manage scripts, extensions, and custom API methods
            from your Node.js or Bun applications.
          </p>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto">
{`npm install @kora/extension-sdk`}
          </pre>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto mt-2">
{`import { KoraClient } from '@kora/extension-sdk'

const kora = new KoraClient({
  baseUrl: 'https://myapp.kora.dev',
  token: 'kxt_your_extension_token'
})

// Create a validation script
await kora.createScript({
  name: 'validate_order',
  script_type: 'doc_event',
  doctype: 'Order',
  event: 'before_save',
  script: \`kora.log.info('Validating:', event.doc.name);
if (!event.doc.total) throw new Error('Total required');\`
})

// Call a custom API method
const invoice = await kora.callMethod('send_invoice', {
  orderId: 'ORD-0001'
})`}
          </pre>
        </div>

        {/* MCP Server */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">MCP Server</h3>
          <p className="text-sm text-[#5d5f5f]">
            Kora auto-generates Model Context Protocol tools from your doctype definitions.
            Connect Claude Desktop, Cursor, or any MCP-compatible client to query and
            manage your data via natural language.
          </p>
          <pre className="bg-[#0A0A0A] text-[#E5E5E5] rounded-lg p-4 text-xs font-mono overflow-x-auto mt-2">
{`# Start the MCP server for a site
./kora mcp --site mysite

# Tools auto-generated: order_list, order_get, order_create, customer_list, ...`}
          </pre>
        </div>

        {/* API Versioning */}
        <div>
          <h3 className="text-base font-semibold text-black mb-2">API Versioning</h3>
          <p className="text-sm text-[#5d5f5f]">
            All REST endpoints are available under both <code className="bg-gray-100 px-1 rounded text-xs">/api/v1/</code>
            (canonical) and <code className="bg-gray-100 px-1 rounded text-xs">/api/</code> prefixes for backward compatibility.
            Swagger UI at <code className="bg-gray-100 px-1 rounded text-xs">/api/v1/swagger-ui</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
