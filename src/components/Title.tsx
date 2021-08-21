import { Theme, Typography, TypographyProps } from '@material-ui/core';
import React, { FC } from 'react';
import Head from 'next/head';
import { createStyles, makeStyles } from '@material-ui/styles';

interface Props {
	hide?: boolean;
	value?: string;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		content: {
			padding: `${theme.spacing(4)}px 0`,
		},
	}),
);

const Title: FC<Props & TypographyProps> = ({
	children,
	hide,
	value,
	...props
}) => {
	const classes = useStyles();

	const titleValue = value || (typeof children === 'string' && children);
	const title = titleValue
		? `${titleValue} - Bunny Licores`
		: 'Bunny Licores';

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} key="title" />
			</Head>
			{!hide && (
				<Typography
					className={classes.content}
					variant="h4"
					color="primary"
					{...props}
				>
					{titleValue || children}
				</Typography>
			)}
		</>
	);
};

export default Title;
