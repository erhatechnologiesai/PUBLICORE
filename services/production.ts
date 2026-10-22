import { Manuscript } from "@/types";

/**
 * Production Service for Scholarly Publishing
 * Handles JATS XML generation (ANSI/NISO Z39.96-2021) and Crossref DOI metadata registration
 */

export function generateJatsXml(ms: Manuscript): string {
  if (!ms) return "";

  const surname = (name: string) => name.split(" ").slice(-1)[0] || name;
  const givenNames = (name: string) => name.split(" ").slice(0, -1).join(" ") || name;

  const authorsXml = ms.authors
    .map(
      (a) => `      <contrib contrib-type="author" corresp="${a.isCorresponding ? "yes" : "no"}">
        <name>
          <surname>${surname(a.name)}</surname>
          <given-names>${givenNames(a.name)}</given-names>
        </name>
        <aff>${a.institution || "Scholarly Institute"}</aff>
        ${a.orcid ? `<contrib-id contrib-id-type="orcid">https://orcid.org/${a.orcid}</contrib-id>` : ""}
      </contrib>`
    )
    .join("\n");

  const keywordsXml = ms.keywords
    .map((k) => `        <kwd>${k}</kwd>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.3 20210610//EN" "JATS-archivearticle1-3.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" article-type="research-article">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">${ms.journalId || "PUBLICORE"}</journal-id>
      <journal-title-group>
        <journal-title>${ms.journalName || "PUBLICORE Open Journal"}</journal-title>
      </journal-title-group>
      <issn pub-type="epub">2834-9102</issn>
      <publisher>
        <publisher-name>PUBLICORE Scholarly Communications</publisher-name>
      </publisher>
    </journal-meta>
    <article-meta>
      <article-id pub-id-type="doi">${ms.doi || "10.1042/pub.2026.PENDING"}</article-id>
      <title-group>
        <article-title>${ms.title}</article-title>
      </title-group>
      <contrib-group>
${authorsXml}
      </contrib-group>
      <pub-date date-type="pub" iso-8601-date="${ms.updatedAt || new Date().toISOString().split("T")[0]}">
        <year>2026</year>
      </pub-date>
      <abstract>
        <p>${ms.abstract || "No abstract provided."}</p>
      </abstract>
      <kwd-group kwd-group-type="author">
${keywordsXml}
      </kwd-group>
    </article-meta>
  </front>
</article>`.trim();
}

export function validateJatsXml(xml: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push("Missing standard XML declaration header");
  }
  if (!xml.includes("JATS-archivearticle1-3.dtd")) {
    errors.push("Missing valid NLM/JATS DTD doctype declaration");
  }
  if (!xml.includes("<article-meta>")) {
    errors.push("Missing mandatory <article-meta> container element");
  }
  if (!xml.includes("<article-id pub-id-type=\"doi\">")) {
    errors.push("Missing registered Crossref DOI identifier node");
  }
  if (!xml.includes("<contrib-group>")) {
    errors.push("Missing author attribution list <contrib-group>");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateDoi(doi: string): boolean {
  // Crossref DOI standard: 10.xxxx/...
  const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;
  return doiRegex.test(doi);
}

export function generateCrossrefDoiMetadata(ms: Manuscript) {
  const doi = ms.doi || `10.1042/pub.2026.${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    doi,
    timestamp: Date.now(),
    depositor: {
      name: "PUBLICORE Scholarly System",
      email: "deposits@publicore.org",
    },
    registrant: "PUBLICORE Open Access Foundation",
    records: [
      {
        resource: `https://publicore.org/articles/${ms.code?.toLowerCase() || ms.id}`,
        title: ms.title,
        contributors: ms.authors.map((a, i) => ({
          sequence: i === 0 ? "first" : "additional",
          name: a.name,
          institution: a.institution,
          orcid: a.orcid ? `https://orcid.org/${a.orcid}` : undefined,
        })),
        publicationDate: {
          year: 2026,
          month: 10,
        },
      },
    ],
  };
}
