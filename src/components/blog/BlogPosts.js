import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Title from '../Title';
import Section from '../Section';
import { List } from '../layout/list/List';
import { ListItem, HeaderImage, Body, Dates, Title as ListTitle } from '../layout/list/List';

export default () => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
            }
            excerpt
          }
        }
      }
    }
  `);
  return (
    <Section bg="background">
      <Title slug="blog-posts">Blog Posts</Title>
      <List>
        {data.allMarkdownRemark.edges.map(({ node: { frontmatter: { title, date, thumbnail }, fields: { slug } } }) => (
          <ListItem key={slug}>
            {!!thumbnail && <HeaderImage to={slug} fluid={thumbnail.childImageSharp.fluid} />}
            <Body>
              <Dates>{date}</Dates>
              <ListTitle to={slug} fontSize={3}>
                {title}
              </ListTitle>
            </Body>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};
