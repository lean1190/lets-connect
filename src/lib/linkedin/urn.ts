export function getLinkedInAuthorUrn(id?: string) {
  return id ? `urn:li:person:${id}` : null;
}

export function getLinkedInUrnLastPart(urn: string) {
  return urn.split(':').pop();
}
