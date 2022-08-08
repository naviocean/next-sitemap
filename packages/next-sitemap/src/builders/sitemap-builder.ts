import type { ISitemapField, IAlternateRef } from '../interface.js'

/**
 * Builder class to generate xml and robots.txt
 * Returns only string values
 */
export class SitemapBuilder {
  /**
   * Create XML Template
   * @param content
   * @returns
   */
  withXMLTemplate(content: string, siteUrl?: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl}/sitemap.xsl"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xsi:schemaLocation="
            http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${content}
</urlset>`
    // return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n\t${content}\n</urlset>`
  }

  /**
   * Generates sitemap-index.xml
   * @param allSitemaps
   * @returns
   */
  buildSitemapIndexXml(allSitemaps: string[], siteUrl?: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl}/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allSitemaps
    ?.map(
      (x) =>
        `<sitemap>\n\t\t<loc>${x}</loc>\n\t\t<lastmod>${new Date().toISOString()}</lastmod>\n\t</sitemap>`
    )
    .join('\n\t')}
</sitemapindex>`
  }

  /**
   * Normalize sitemap field keys to stay consistent with <xsd:sequence> order
   * @link https://www.w3schools.com/xml/el_sequence.asp
   * @link https://github.com/iamvishnusankar/next-sitemap/issues/345
   * @param x
   * @returns
   */
  normalizeSitemapField(x: ISitemapField) {
    const { loc, lastmod, changefreq, priority, ...restProps } = x

    // Return keys in following order
    return {
      loc,
      lastmod,
      changefreq,
      priority,
      ...restProps,
    }
  }

  /**
   * Generates sitemap.xml
   * @param fields
   * @returns
   */
  buildSitemapXml(fields: ISitemapField[], siteUrl?: string): string {
    const content = fields
      .map((x: ISitemapField) => {
        // Normalize sitemap field keys to stay consistent with <xsd:sequence> order
        const field = this.normalizeSitemapField(x)

        // Field array to keep track of properties
        const fieldArr: Array<string> = []

        // Iterate all object keys and key value pair to field-set
        for (const key of Object.keys(field)) {
          // Skip reserved keys
          if (['trailingSlash'].includes(key)) {
            continue
          }

          if (field[key]) {
            if (key !== 'alternateRefs') {
              fieldArr.push(`\n\t\t\t<${key}>${field[key]}</${key}>`)
            } else {
              const altRefField = this.buildAlternateRefsXml(
                field.alternateRefs
              )

              fieldArr.push(altRefField)
            }
          }
        }

        // Append previous value and return
        return `<url>${fieldArr.join('')}\n\t</url>`
      })
      .join('\n\t')

    return this.withXMLTemplate(content, siteUrl)
  }

  /**
   * Generate alternate refs.xml
   * @param alternateRefs
   * @returns
   */
  buildAlternateRefsXml(alternateRefs: Array<IAlternateRef> = []): string {
    return alternateRefs
      .map((alternateRef) => {
        return `\n\t\t\t<xhtml:link rel="alternate" hreflang="${alternateRef.hreflang}" href="${alternateRef.href}"/>`
      })
      .join('')
  }
}
