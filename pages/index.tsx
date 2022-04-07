import Head from 'next/head'
import {sanityClient} from '../sainty'
import Header from '../components/Header'
import Banner from '../components/Banner'
import {IProps, IPost} from '../typings'
import Posts from '../components/Posts'

const Home = ({posts}: IProps) => {
    return (
        <div className="max-w-7xl mx-auto">
            <Head>
                <title>Median - Where good ideas find you.</title>
            </Head>
            <Header/>
            <Banner/>
            <Posts posts={posts}/>
        </div>
    )
}

export default Home

export const getServerSideProps = async () => {
    const query = `
   * [_type == "post"]{
    _id,
    title, 
    author -> {
        name,
        image
    },
    description,
    mainImage,
    slug {
        current
    },
   }
`

    const posts = await sanityClient.fetch(query)
    return {
        props: {
            posts,
        },
    }
}

