import { HTMLAttributeAnchorTarget, ReactNode, useMemo } from "react";
import type { GetStaticProps, NextPage } from "next";
import { Button, Grid, styled } from "@mui/material";
import {
  Email as EmailIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  SvgIconComponent,
} from "@mui/icons-material";
import { exec } from "child_process";
import { promisify } from "util";

const Root = styled("div", { name: "Home", slot: "root" })(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100vh",
  margin: 0,
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Revision = styled("span", { name: "Home", slot: "revision" })(
  ({ theme }) => ({
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    textAlign: "right",
  })
);

interface HomeProps {
  readonly className?: string;
  readonly revision: readonly [gitHEAD: string, timestamp: number];
}

interface Social {
  readonly icon: SvgIconComponent;
  readonly href: string;
  readonly target?: HTMLAttributeAnchorTarget;
  readonly children: ReactNode;
}

const socials: ReadonlyArray<Social> = (
  [
    {
      icon: EmailIcon,
      href: (process.env.NEXT_PUBLIC_APP_EMAIL
        ? `mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`
        : undefined)!,
      target: "_top",
      children: "Email",
    },
    {
      icon: GitHubIcon,
      href: process.env.NEXT_PUBLIC_APP_GITHUB_URL!,
      target: "_blank",
      children: "GitHub",
    },
    {
      icon: TwitterIcon,
      href: process.env.NEXT_PUBLIC_APP_TWITTER_URL!,
      target: "_blank",
      children: "Twitter",
    },
    {
      icon: LinkedInIcon,
      href: process.env.NEXT_PUBLIC_APP_LINKEDIN_URL!,
      target: "_blank",
      children: "LinkedIn",
    },
  ] as const
).filter(
  (social: Partial<Social>): social is Social => typeof social.href === "string"
);

const Home: NextPage<HomeProps> = (props) => {
  const { className, revision } = props;

  const [rev, date] = useMemo(() => {
    const [hash, timestamp] = revision;
    return [hash.slice(0, 7), new Date(timestamp).toISOString()] as const;
  }, [revision]);

  return (
    <Root className={className}>
      <div>
        <Grid
          container
          spacing={2}
          alignItems="center"
          alignContent="center"
          justifyContent="center"
          justifyItems="center"
        >
          {socials.map(({ icon: Icon, href, target, children }, index) => (
            <Grid item key={index}>
              <Button
                startIcon={<Icon fontSize="inherit" color="inherit" />}
                component="a"
                variant="text"
                size="large"
                href={href}
                target={target}
              >
                {children}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
      <Revision>
        {rev} {date}
      </Revision>
    </Root>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const childProcessExec = promisify(exec);

  return {
    props: {
      revision: [
        (await childProcessExec("git rev-parse HEAD")).stdout.trim(),
        Date.now(),
      ] as const,
    },
  };
};
