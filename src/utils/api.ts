export async function loadContent(page: number) {
  return await fetch(`https://reqres.in/api/users?page=${page}`).then(res => res.json())
}
