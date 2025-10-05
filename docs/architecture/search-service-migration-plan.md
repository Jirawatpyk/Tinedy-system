# Search Service Migration Plan

**Created**: 2025-10-05
**Status**: Planning
**Related Story**: 1.11 Search Bookings
**Epic**: Epic 1 - Core Booking Management

---

## Current Implementation (MVP)

### Approach
- **Client-side filtering** after fetching data from Firestore
- JavaScript string methods: `toLowerCase()`, `includes()`
- Search fields: customer name, phone, email, address

### Limitations
- Performance degrades with large datasets (>5000 bookings)
- No full-text search capabilities
- No typo tolerance
- No search analytics
- Limited to exact substring matching

### Current Performance
- Acceptable for MVP (<100 bookings)
- Search debounce: 300ms
- Target response time: <500ms

---

## Production Search Service Options

### Option 1: Algolia (Recommended)

**Pros:**
- Best-in-class search experience
- Built-in Thai language support
- Typo tolerance and fuzzy matching
- Search-as-you-type performance (<50ms)
- Faceted search and filtering
- Search analytics dashboard
- Easy integration with Firestore
- Managed service (no infrastructure)

**Cons:**
- Cost: ~$1/1000 searches after free tier
- Vendor lock-in
- Data sync required

**Estimated Cost:**
- Free tier: 10,000 records, 100,000 operations/month
- Growth plan: $0.50/1000 records + $0.40/1000 search requests
- For 10,000 bookings, ~100,000 searches/month: ~$45/month

**Integration Effort:** 2-3 days

---

### Option 2: Typesense (Self-hosted)

**Pros:**
- Open-source and self-hosted
- Similar features to Algolia
- One-time setup cost
- No vendor lock-in
- Good Thai language support
- Typo tolerance

**Cons:**
- Infrastructure management required
- Need to maintain search cluster
- Scaling complexity
- No built-in analytics

**Estimated Cost:**
- Cloud Run instance: ~$20-50/month
- Data egress: ~$10/month
- Total: ~$30-60/month

**Integration Effort:** 5-7 days (including infrastructure setup)

---

### Option 3: ElasticSearch

**Pros:**
- Industry standard
- Powerful query DSL
- Advanced analytics
- Full-text search with Thai support

**Cons:**
- Complex setup and configuration
- Heavy infrastructure requirements
- Overkill for current needs
- Steep learning curve
- Higher operational cost

**Estimated Cost:**
- Elastic Cloud: ~$95/month (basic tier)
- Self-hosted: ~$100-200/month (compute + storage)

**Integration Effort:** 10-15 days

---

## Recommended Approach: Algolia

### Why Algolia?
1. **Time to Market**: Fastest integration (2-3 days)
2. **Developer Experience**: Best documentation and SDKs
3. **Performance**: Sub-50ms search responses
4. **Thai Support**: Built-in Thai language analyzer
5. **Cost-Effective**: Free tier sufficient for early growth
6. **Zero Ops**: Fully managed, no infrastructure

### Migration Trigger
Migrate when:
- Booking count exceeds **100 records**, OR
- Search performance degrades below **500ms p95**, OR
- User requests advanced features (typo tolerance, facets)

---

## Migration Implementation Plan

### Phase 1: Setup (1 day)
1. Create Algolia account
2. Configure index schema
3. Set up Thai language settings
4. Configure API keys (search-only, admin)

### Phase 2: Data Sync (1 day)
1. Create Cloud Function for Firestore → Algolia sync
2. Implement onCreate, onUpdate, onDelete triggers
3. Backfill existing bookings
4. Test sync with sample data

**Cloud Function Example:**
```typescript
// functions/src/algolia-sync.ts
export const syncBookingToAlgolia = functions.firestore
  .document('bookings/{bookingId}')
  .onWrite(async (change, context) => {
    const algoliaIndex = algoliaClient.initIndex('bookings');

    if (!change.after.exists) {
      // Delete
      await algoliaIndex.deleteObject(context.params.bookingId);
      return;
    }

    const booking = change.after.data();
    const searchableData = {
      objectID: context.params.bookingId,
      customerName: booking.customer.name,
      customerPhone: booking.customer.phone,
      customerEmail: booking.customer.email,
      customerAddress: booking.customer.address,
      status: booking.status,
      serviceType: booking.service.type,
      scheduledDate: booking.schedule.date,
      _tags: [booking.status, booking.service.type],
    };

    await algoliaIndex.saveObject(searchableData);
  });
```

### Phase 3: Frontend Integration (0.5 day)
1. Install `algoliasearch` and `react-instantsearch`
2. Replace fetch call with Algolia search
3. Keep same React component interface
4. Test with production data

**Frontend Example:**
```typescript
// hooks/useBookings.ts (updated)
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export function useBookings(params: UseBookingsParams = {}) {
  const { search, status, page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: ['bookings', { search, status, page, limit }],
    queryFn: async () => {
      if (!search) {
        // Fallback to Firestore for non-search queries
        return fetchFromFirestore();
      }

      const index = searchClient.initIndex('bookings');
      const { hits, nbHits } = await index.search(search, {
        filters: status ? `status:${status}` : '',
        page: page - 1,
        hitsPerPage: limit,
      });

      return {
        bookings: hits,
        pagination: {
          page,
          limit,
          total: nbHits,
          totalPages: Math.ceil(nbHits / limit),
        },
      };
    },
  });
}
```

### Phase 4: Testing (0.5 day)
1. Test search across all fields
2. Test Thai character search
3. Test typo tolerance
4. Performance testing (p50, p95, p99)
5. Load testing (100 concurrent searches)

### Phase 5: Deployment (0.5 day)
1. Deploy Cloud Functions
2. Backfill production data
3. Feature flag rollout (10% → 50% → 100%)
4. Monitor performance and errors
5. Rollback plan ready

**Total Effort**: 3-4 days

---

## Index Schema

```json
{
  "searchableAttributes": [
    "customerName",
    "customerPhone",
    "customerEmail",
    "customerAddress"
  ],
  "attributesForFaceting": [
    "status",
    "serviceType",
    "scheduledDate"
  ],
  "customRanking": [
    "desc(createdAt)"
  ],
  "indexLanguages": ["th", "en"],
  "queryLanguages": ["th", "en"],
  "attributesToHighlight": [
    "customerName",
    "customerPhone",
    "customerEmail"
  ],
  "highlightPreTag": "<mark class=\"bg-yellow-200 font-medium\">",
  "highlightPostTag": "</mark>"
}
```

---

## Performance Targets

### Current (Firestore)
- P50: ~200ms
- P95: ~500ms
- P99: ~800ms

### Target (Algolia)
- P50: <50ms
- P95: <100ms
- P99: <200ms

**Expected Improvement**: 5-10x faster

---

## Cost Analysis

### Scenario 1: Small Scale (0-6 months)
- Bookings: 500
- Searches: 10,000/month
- Cost: **$0** (free tier)

### Scenario 2: Medium Scale (6-12 months)
- Bookings: 5,000
- Searches: 100,000/month
- Cost: **$45/month**

### Scenario 3: Large Scale (12-24 months)
- Bookings: 50,000
- Searches: 500,000/month
- Cost: **$225/month**

**ROI**: Improved UX leads to higher booking conversion and customer satisfaction

---

## Rollback Plan

If Algolia integration fails:
1. Revert frontend to Firestore queries (keep old code)
2. Disable Cloud Function triggers
3. Monitor for 24 hours
4. Post-mortem analysis

**Rollback Time**: <30 minutes

---

## Success Metrics

### Technical
- [ ] Search response time <100ms (p95)
- [ ] 99.9% search availability
- [ ] Zero data sync errors

### Business
- [ ] User search engagement increases
- [ ] Time to find booking decreases by 50%
- [ ] Search abandonment rate <5%

### User Experience
- [ ] Typo tolerance works for common mistakes
- [ ] Thai language search works correctly
- [ ] Highlighting improves result scanning

---

## Future Enhancements

After successful Algolia migration:
1. **Search Analytics**: Track popular queries, no-result searches
2. **Autocomplete**: Suggest results as user types
3. **Filters**: Add faceted search (status, date range, service type)
4. **Personalization**: Show recent searches, suggested bookings
5. **Voice Search**: Integrate with Web Speech API

---

## Decision: Defer to Future Epic

**Status**: Deferred
**Reason**: Current client-side search acceptable for MVP
**Migration Trigger**: 100+ bookings or <500ms p95 performance
**Story to Create**: "Epic 7: Technical Improvements - Story 7.X: Migrate to Algolia Search"

---

## References

- [Algolia Documentation](https://www.algolia.com/doc/)
- [Algolia Firestore Extension](https://www.algolia.com/doc/tools/extensions/firestore/)
- [Thai Language Support](https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/language-specific-configurations/#thai)
- [Pricing Calculator](https://www.algolia.com/pricing/)

---

**Last Updated**: 2025-10-05
**Author**: Dev Agent (James)
