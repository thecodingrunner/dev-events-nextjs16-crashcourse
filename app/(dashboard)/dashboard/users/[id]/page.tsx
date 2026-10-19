const UserDetails = async ({ params }: { params: Promise<{ id: string }>}) => {
    const { id } = await params;

    return (
        <h1>Showing details for user #{id}</h1>
    )
}
export default UserDetails
