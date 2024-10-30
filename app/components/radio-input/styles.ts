import { makeStyles } from "@rneui/themed"

const useStyles = makeStyles((colors) => ({
  icon: {
    marginRight: 5,
    color: colors?.colors?.grey3,
  },
  activeRadio: {
    color: colors?.colors?.blue5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
}))

export default useStyles
