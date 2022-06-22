import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Container,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Delete, Create } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const styles = makeStyles({
  login_box: {
    marginTop: "20%",
    marginRight: "5%",
    marginLeft: "5%",
    marginBottom: "10%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "0 solid #DFDCDC",
    borderTopWidth: "0.1px",
    borderLeftWidth: "0.1px",
    borderRadius: "10px 10px 10px 10px",
    paddingBottom: "30px",
    paddingTop: "60px",
    WebkitBoxShadow: "27px 43px 43px -20px rgba(89,89,89,0.39)",
  },
});

function Home() {
  const [list, setList] = useState([]);
  const [idx, setIdx] = useState(false);
  const [retitle, setReTitle] = useState("");
  const [on, setOn] = useState(true);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const classes = styles();
  const token = sessionStorage.getItem("key");

  async function get() {
    const config = {
      headers: {
        authorization: `bearer ${token}`,
      },
    };
    const res = await axios.get("http://localhost:8080/", config);
    if (res.data.length === 0) {
      return setOn(true);
    }
    return setList(res.data);
  }

  async function Deletes(id) {
    const res = await axios.delete(`http://localhost:8080/${id}`);
    if (res.data) {
      alert("삭제되었습니다.");
      return get();
    }
  }

  async function ret() {
    const data = {
      idx: idx,
      title: retitle,
    };

    const res = await axios.put("http://localhost:8080/", data);
    if (res.data) {
      setIdx(false);
      return get();
    }
  }

  async function onClick(e) {
    e.preventDefault();

    const data = {
      mid: list[0].mid,
      title: title,
    };

    const res = await axios.post("http://localhost:8080/", data);
    if (res.data) {
      setTitle("");
      return get();
    }
  }

  useEffect(() => {
    if (token === null) {
      return setOn(false);
    } else {
      get();
    }
  }, []);
  return (
    <>
      {on ? (
        <Container component={"main"} maxWidth="md">
          <Box className={classes.login_box}>
            <Typography fontWeight={"bolder"} sx={{ mb: 4, fontSize: "25px" }}>
              오늘의 할일
            </Typography>
            <Box display={"flex"} mb={4}>
              <TextField
                type="text"
                size="small"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button size="small" variant="contained" onClick={onClick}>
                추가
              </Button>
            </Box>
            {list.map((v) => (
              <Box display={"flex"} key={v.idx}>
                <Box
                  mr={4}
                  display="flex"
                  sx={{
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  <Typography mr={1}>{v.idx}.</Typography>
                  {v.idx === idx ? (
                    <TextField
                      size="small"
                      value={retitle}
                      onChange={(e) => setReTitle(e.target.value)}
                    />
                  ) : (
                    <Typography>{v.title}</Typography>
                  )}
                </Box>
                {v.idx === idx ? (
                  <Box>
                    <Button variant="contained" onClick={ret}>
                      수정
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <IconButton
                      aria-label="retouch"
                      size="small"
                      onClick={() => {
                        setIdx(v.idx);
                        setReTitle(v.title);
                      }}
                    >
                      <Create fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => Deletes(v.idx)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Container>
      ) : (
        <Container component={"main"} maxWidth="md">
          <Box className={classes.login_box}>
            <Typography fontWeight={"bolder"} sx={{ mb: 20, fontSize: "25px" }}>
              로그인을 해주세요.
            </Typography>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
}

export default Home;
