import type { GetStaticProps, NextPage } from "next";
import { Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Email as EmailIcon } from "@mui/icons-material";
import clsx from "clsx";
import { exec } from "child_process";
import { promisify } from "util";
import { useMemo } from "react";

const useStyles = makeStyles(
  ({ spacing, palette }) => ({
    root: {
      backgroundColor: palette.background.default,
      height: "100vh",
      margin: 0,
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    revision: {
      position: "absolute",
      bottom: spacing(1),
      right: spacing(1),
    },
    button: {},
  }),
  { name: "Home" }
);

interface HomeProps {
  readonly classes?: Readonly<
    Partial<Record<keyof ReturnType<typeof useStyles>, string>>
  >;
  readonly className?: string;
  readonly revision: readonly [gitHEAD: string, timestamp: number];
}

const Home: NextPage<HomeProps> = (props) => {
  const {
    root: rootClassName,
    revision: revisionClassName,
    button: buttonClassName,
  } = useStyles(props);
  const { className, revision } = props;

  const [rev, date] = useMemo(() => {
    const [hash, timestamp] = revision;
    return [hash.slice(0, 7), new Date(timestamp).toISOString()] as const;
  }, [revision]);

  return (
    <div className={clsx(rootClassName, className)}>
      <div className={buttonClassName}>
        <Button
          startIcon={<EmailIcon fontSize="inherit" color="inherit" />}
          component="a"
          variant="text"
          size="large"
          href={`mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`}
          target="_blank"
        >
          email me
        </Button>
      </div>
      <Typography className={revisionClassName} variant="caption">
        {rev} {date}
      </Typography>
    </div>
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
