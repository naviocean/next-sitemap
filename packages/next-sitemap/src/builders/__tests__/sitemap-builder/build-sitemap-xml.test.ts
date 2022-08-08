import { SitemapBuilder } from '../../sitemap-builder.js'

describe('SitemapBuilder', () => {
  test('snapshot test to exclude undefined values from final sitemap', () => {
    // Builder instance
    const builder = new SitemapBuilder()

    // Build content
    const content = builder.buildSitemapXml([
      {
        loc: 'https://example.com',
        lastmod: undefined,
      },
      {
        loc: 'https://example.com',
        lastmod: 'some-value',
        alternateRefs: [
          {
            href: 'https://example.com/en',
            hreflang: 'en',
          },
          {
            href: 'https://example.com/fr',
            hreflang: 'fr',
          },
        ],
      },
    ])

    // Expect the generated sitemap to match snapshot.
    expect(content).toMatchInlineSnapshot(`
      "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
      <?xml-stylesheet type=\\"text/xsl\\" href=\\"undefined/sitemap.xsl\\"?>
      <urlset
            xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\"
            xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\"
            xmlns:xhtml=\\"http://www.w3.org/1999/xhtml\\"
            xmlns:news=\\"http://www.google.com/schemas/sitemap-news/0.9\\"
            xsi:schemaLocation=\\"
                  http://www.sitemaps.org/schemas/sitemap/0.9
                  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\\">
          <url>
      			<loc>https://example.com</loc>
      	</url>
      	<url>
      			<loc>https://example.com</loc>
      			<lastmod>some-value</lastmod>
      			<xhtml:link rel=\\"alternate\\" hreflang=\\"en\\" href=\\"https://example.com/en\\"/>
      			<xhtml:link rel=\\"alternate\\" hreflang=\\"fr\\" href=\\"https://example.com/fr\\"/>
      	</url>
      </urlset>"
    `)
  })
})
