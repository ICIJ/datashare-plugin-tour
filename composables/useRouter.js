import { useCore } from '@/composables/useCore'

export function useRouter() {
  const { router, stores } = useCore()
  const searchStore = stores.useSearchStore()

  /**
   * Navigates to a specified route if it is different from the current route.
   *
   * @param {object} to - The route object to navigate to.
   * @param {string} to.name - The name of the route.
   * @param {object} [to.params] - The parameters for the route.
   * @param {object} [to.query] - The query parameters for the route.
   *
   * @returns {Promise} - A promise that resolves when the navigation is complete.
   */
  async function navigate(to) {
    const { href } = router.resolve(to)
    if (href !== router.currentRoute.value.href) {
      router.push(to)
    }
  }

  async function navigateToSearch() {
    const query = searchStore.toRouteQuery
    return navigate({ name: 'search', query })
  }

  async function navigateToFirstSearchHit(query = { modal: true }) {
    const [document] = searchStore.hits
    const params = { ...document.routerParams }
    await navigate({ name: 'document', params, query })
  }

  return { router, navigate, navigateToSearch, navigateToFirstSearchHit }
}
