import Container from '@components/Container';
import Page from '@components/Page';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { BlogPostData, getBlogPost, getBlogPostSlugs } from '@lib/blog';
import hydrate from 'next-mdx-remote/hydrate';
import { blogMdxComponents } from '@utils/mdx';
import Post from '@components/Blog/Post';
import Header from '@components/Header';
import SocialLinks from '@components/SocialLinks';
import { Flex, useColorMode, useColorModeValue, useToken } from '@chakra-ui/react';
import 'katex/dist/katex.min.css';

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getBlogPostSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getBlogPost(params.slug as string);
  return { props: post };
};

export interface BlogPostProps extends BlogPostData {}

const BlogPost: React.FC<BlogPostProps> = ({
  body,
  frontmatter: { title, coverImage, created },
}) => {
  const content = hydrate(body, { components: blogMdxComponents });

  return (
    <>
      <Header />
      <Page title={title} openGraph={{ images: [{ ...coverImage, url: coverImage.src }] }}>
        <Container>
          <Post
            pt={4}
            title={title}
            coverImage={coverImage}
            created={created}
            sx={{
              // Fixes weird katex fraction line being gray
              '.frac-line': {
                borderColor: 'var(--text-color)',
              },
            }}
          >
            {content}
          </Post>

          <Flex my={6}>
            <SocialLinks mx="auto" />
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default BlogPost;
