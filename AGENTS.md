<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Apply container presentation centrally through `src/lib/hockey-skins.ts` and semantic surface tokens in `src/styles.css`; this keeps dynamically opened sheets and page placards consistent without changing coaching logic.
- Store rink-view selection separately from full-rink drawing coordinates; cropping either end must preserve marker positions and saved-play views.
