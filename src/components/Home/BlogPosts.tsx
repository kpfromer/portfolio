import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Title } from '../common/Title';
import { Section } from '../common/Section';
import { List, ListItem, HeaderImage, Body, Dates, Title as ListTitle } from '../List';
import { BoxProps } from 'rebass';

const BlogPosts: React.FC<Omit<BoxProps, 'css'>> = (props) => {
  const data = useStaticQuery<GatsbyTypes.BlogPostsQuery>(graphql`
    query BlogPosts {
      allMdx(
        sort: { fields: [frontmatter___date], order: DESC }
        # TODO: better solution for filtering for blog items (and not about.tsx in data/)
        filter: { frontmatter: { hidden: { eq: false }, type: { ne: "home" } } }
      ) {
        totalCount
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "DD MMMM, YYYY")
              thumbnail {
                childImageSharp {
                  fluid(maxWidth: 500) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
            fields {
              slug
              blogPath
            }
          }
        }
      }
    }
  `);
  return (
    <Section {...props}>
      <Title slug="blog-posts">Blog Posts</Title>
      <List>
        {data.allMdx.edges.map(
          ({
            node: {
              frontmatter: { title, date, thumbnail },
              fields: { blogPath },
            },
          }) => (
            <ListItem key={blogPath}>
              {!!thumbnail && <HeaderImage to={blogPath} fluid={thumbnail.childImageSharp.fluid} />}
              <Body>
                <Dates>{date}</Dates>
                <ListTitle to={blogPath} fontSize={3}>
                  {title}
                </ListTitle>
              </Body>
            </ListItem>
          ),
        )}
      </List>
    </Section>
  );
};

export default BlogPosts;
