import React, {useState} from 'react'
import {sanityClient, urlFor} from '../../sainty'
import {IPost} from '../../typings'
import {GetStaticProps} from 'next'
import Header from '../../components/Header'
import PortableText from 'react-portable-text'
import {SubmitHandler, useForm} from 'react-hook-form'
import Head from 'next/head'

interface IProps {
    post: IPost
}

interface IForm {
    _id: string
    name: string
    email: string
    comment: string
}

const Post = ({post}: IProps) => {
    const {register, handleSubmit, formState: {errors}} = useForm<IForm>()
    const [submitted, setSubmitted] = useState<boolean>(false)

    const onSubmit: SubmitHandler<IForm> = async (data) => {
        try {
            await fetch('/api/createComment', {
                method: 'POST',
                body: JSON.stringify(data),
            })
            setSubmitted(true)
        } catch (e) {
            console.log(e)
            setSubmitted(false)
        }
    }

    return (
        <>
            <Head>
                <title>Median - {post.title}</title>
            </Head>
            <Header/>
            <main>
                <img
                    className="w-full h-80 object-cover"
                    src={urlFor(post.mainImage).url()}
                    alt="Article image"
                />
                <article className="max-w-3xl mx-auto p-5">
                    <h1 className="text-3xl md:mt-10 mb-3">{post.title}</h1>
                    <h2 className="text-xl font-light">{post.description}</h2>
                    <div className="flex items-center space-x-2 mt-6">
                        <img
                            className="h-10 w-10 rounded-full border border-black"
                            src={urlFor(post.author.image).url()}
                            alt="Author image"
                        />
                        <p className="font-extra-light text-sm">
                            Blog post by{' '}
                            <span className="text-green-600">{post.author.name}</span>
                            {' '}— Published at {new Date(post._createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <PortableText
                            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                            content={post.body}
                            serializers={{
                                h1: (props: any) => <h1 className="text-4xl font-bold mt-6 mb-3" {...props} />,
                                h2: (props: any) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
                                h3: (props: any) => <h3 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                                h4: (props: any) => <h4 className="text-1xl font-bold mt-6 mb-3" {...props} />,
                                li: ({children}: any) => <li className="ml-4 list-disc">{children}</li>,
                                link: ({href, children}: any) => (
                                    <a href={href} className="text-blue-500 hover:underline">{children}</a>
                                )
                            }}
                        />
                    </div>
                </article>
                <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>
                {
                    submitted ?
                        (
                            <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
                                <h3 className="text-3xl font-bold">Thank you for submitting your comment!</h3>
                                <p>Once it has been approved, it will appear soon!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl m-auto mb-10">
                                <input
                                    {...register('_id')}
                                    type="hidden"
                                    name="_id"
                                    value={post._id}
                                />
                                <label className="block mb-5 ">
                                    <span className="text-gray-700">Name</span>
                                    <input
                                        {...register('name', {required: true})}
                                        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring duration-300"
                                        placeholder="John Doe"
                                        type="text"
                                    />
                                </label>

                                <label className="block mb-5 ">
                                    <span className="text-gray-700">Email</span>
                                    <input
                                        {...register('email', {required: true})}
                                        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring duration-300"
                                        placeholder="johndoe@gmail.com"
                                        type="email"
                                    />
                                </label>

                                <label className="block mb-5 ">
                                    <span className="text-gray-700">Comment</span>
                                    <textarea
                                        {...register('comment', {required: true})}
                                        className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring duration-300"
                                        placeholder="What a wonderful and catching article!"
                                        rows={8}
                                    />
                                </label>
                                <div className="flex flex-col p-5">
                                    {errors.name &&
                                        <span className="text-red-500">- The name field is required</span>
                                    }
                                    {errors.email &&
                                        <span className="text-red-500">- The email field is required</span>
                                    }
                                    {errors.comment &&
                                        <span className="text-red-500">- The commentary field is required</span>
                                    }
                                </div>
                                <input
                                    className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none
                        text-white font-bold py-2 px-4 rounded cursor-pointer duration-300"
                                    type="submit" value="Leave a comment"/>
                            </form>
                        )}
                <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
                    <h3 className="text-4xl">Comments</h3>
                    <hr className="pb-2"/>
                    {post.comments.map((comment) => (
                        <div key={comment._id}>
                            <p>
                                <span className="text-yellow-500">{comment.name}</span>
                                {' '}:{' '}
                                {comment.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default Post

export const getStaticPaths = async () => {
    const query = `
       *[_type == "post"]{
        _id,
        slug {
            current
         }
       }`

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: IPost) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = ` *[_type == "post" && slug.current == $slug] [0]{
            _id,
            _createdAt,
            title,
            author -> {
                name,
                image,
            },
            'comments': *[
                _type == "comment" &&
                post._ref == ^._id &&
                approved == true],
            description,
            mainImage,
            slug,
            body,
        }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post
        }
    }
}
