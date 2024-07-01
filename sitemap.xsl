<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">

        <html>
        <head>
            <title>XML Sitemap</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    padding: 20px;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                th, td {
                    text-align: left;
                    padding: 8px;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>XML Sitemap</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>URL</th>
                        <th>Last Modified</th>
                        <th>Change Frequency</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    <xsl:apply-templates select="sitemap:urlset/sitemap:url">
                        <xsl:sort select="number(sitemap:priority)" order="descending"/>
                    </xsl:apply-templates>
                </tbody>
            </table>
        </body>
        </html>
        
    </xsl:template>

    <xsl:template match="sitemap:url">
        <xsl:variable name="position" select="position()" />
        <tr>
            <td><xsl:value-of select="$position"/></td>
            <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
            <td><xsl:value-of select="sitemap:lastmod"/></td>
            <td><xsl:value-of select="sitemap:changefreq"/></td>
            <td><xsl:value-of select="sitemap:priority"/></td>
        </tr>
    </xsl:template>
</xsl:stylesheet>
