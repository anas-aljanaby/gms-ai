---
name: country-combobox
description: Add searchable country combobox fields (dropdown + free text) using CountryCombobox and countryOptions. Use when adding or editing country fields in GMS forms, modals, or detail views for donors, beneficiaries, or similar entities.
---

# Country Combobox

GMS country fields use a **combobox**: curated Gulf/MENA list, filter-as-you-type, pick from dropdown, or type a custom value. Values are stored as **English country names** in the DB (e.g. `Turkey`, `UAE`, `Saudi Arabia`).

## Building blocks

| File | Role |
|------|------|
| `apps/web/src/components/common/CountryCombobox.tsx` | Reusable UI component |
| `apps/web/src/lib/countryOptions.ts` | `DEFAULT_COUNTRY_OPTIONS` + `mergeCountryOptions()` |
| `apps/web/public/locales/{en,ar}/common.json` | `common.countryField.placeholder`, `common.countryField.noResults` |

## When to use

Replace plain `<input type="text">` for country when the user needs:
- A suggested list (Gulf/MENA defaults)
- Search/filter within the list
- Ability to enter a country not in the list

**Do not use** for filter-only `<select>` bars (e.g. AdvancedFilterPanel country filter) unless the user asks to upgrade those too.

## Implementation checklist

1. **Import** `CountryCombobox` from `../../common/CountryCombobox` (adjust path depth).

2. **Wire state** — keep existing `country` string state; `onChange={setCountry}` or update form object.

3. **Pass `existingCountries`** — merge org-specific values already in the list:
   ```tsx
   // List page (already computed for filters)
   const countries = useMemo(
     () => Array.from(new Set(records.map((r) => r.country).filter(Boolean))).sort(),
     [records],
   );

   <AddModal existingCountries={countries} />
   <DetailView existingCountries={countries} />
   ```

4. **Render** inside a label (match sibling field layout):
   ```tsx
   <label className="block min-w-0">
     <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
       {t('individual_donors.modal.country')}
     </span>
     <CountryCombobox
       value={country}
       onChange={setCountry}
       existingCountries={existingCountries}
       placeholder={t('common.countryField.placeholder')}
       noResultsText={t('common.countryField.noResults')}
       className="mt-1"
     />
   </label>
   ```

5. **Trim on save** — `country: country.trim()` in submit handlers.

6. **Translations** — use `common.countryField.*` (both `en` and `ar` in `common.json`). Do not hardcode UI strings.

7. **Prop drilling** — if detail/edit lives in a child tab, pass `existingCountries` from list module → detail shell → tab/modal.

## Reference implementations

| Module | Create | Edit |
|--------|--------|------|
| Beneficiaries | `AddBeneficiaryModal.tsx` | `OverviewTab.tsx` (contact edit) |
| Individual donors | `AddDonorModal.tsx` | `DonorDetailView.tsx` (header edit) |

## Adding a default country

Edit `DEFAULT_COUNTRY_OPTIONS` in `countryOptions.ts`. Keep English names sorted via `mergeCountryOptions()`. Do not add translation keys per country unless the product switches to localized stored values.

## Component props

```tsx
interface CountryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  existingCountries?: string[];  // merged with defaults
  placeholder?: string;
  noResultsText?: string;
  className?: string;
  id?: string;
}
```

## UX notes

- Dropdown opens on focus; filters as user types.
- Arrow keys + Enter select; Escape closes.
- `noResultsText` confirms custom values are allowed when nothing matches.
- `z-30` on dropdown — safe inside modals; re-snapshot if testing with Playwright after open.
