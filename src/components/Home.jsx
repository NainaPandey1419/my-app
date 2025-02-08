import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  FormGroup,
  Grid,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const initialItems = [
  { name: "Nail gel", classification: "3N" },
  { name: "Varnish", classification: "3N" },
  { name: "Lacquer", classification: "3N" },
  { name: "Topcoat", classification: "3N" },
  { name: "Matte topcoat", classification: "3N" },
  { name: "Glitter topcoat", classification: "3N" },
  { name: "Basecoat", classification: "3N" },
  { name: "Matte basecoat", classification: "3N" },
  { name: "Glitter basecoat", classification: "3N" },
  { name: "Bonder", classification: "3N" },
  { name: "Primer", classification: "3N" },
  { name: "Strengthener", classification: "3N" },
  { name: "Dehydrator", classification: "3N" },
  { name: "Activator", classification: "U" },
  { name: "Extension gel", classification: "3N" },
  { name: "Nail glitter", classification: "U" },
  { name: "Nail french tip", classification: "NH" },
  { name: "Slip solution", classification: "3N" },
  { name: "Brush saver", classification: "U" },
  { name: "Nail glue", classification: "NH" },
  { name: "Brush", classification: "NH" },
  { name: "Rhinestones", classification: "NH" },
  { name: "File", classification: "NH" },
  { name: "Pusher", classification: "NH" },
  { name: "Separator", classification: "NH" },
  { name: "Clipper", classification: "NH" },
  { name: "Multipurpose nail product", classification: "3N" },
  { name: "Nail paint remover without acetone", classification: "1993,III,2" },
  { name: "Nail paint remover", classification: "1090" },
  { name: "Monomer", classification: "U" },
  { name: "Nail wipes (individually wrapped)", classification: "NH" },
  { name: "Nail wipes (bulk wrapped)", classification: "U" },
  { name: "Cuticle oil", classification: "NH" },
  { name: "UV lamp", classification: "UB" },
  { name: "Dryer fan", classification: "UB" },
  { name: "Electric nail file", classification: "UB" },
  { name: "Electric file", classification: "UB" },
  { name: "Dip powder", classification: "NH" },
  { name: "Hardener", classification: "U" },
  { name: "Conditioner", classification: "U" },
];

const initialClassifications = [
  { label: "Macro", rank: 0 },
  { label: "UB", rank: 2 },
  { label: "NH", rank: 6 },
  { label: "U", rank: 1 },
  { label: "3N", rank: 4 },
  { label: "1090", rank: 3 },
  { label: "1993,III,2", rank: 5 },
];

export const Home = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [allItems, setAllItems] = useState(initialItems);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showClassificationForm, setShowClassificationForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [classificationDialogOpen, setClassificationDialogOpen] =
    useState(false);
  const [dialogStep, setDialogStep] = useState(1);
  const [hasDocumentation, setHasDocumentation] = useState(null);
  const [classifications, setClassifications] = useState(
    initialClassifications
  );
  const [lowestRankedProduct, setLowestRankedProduct] = useState(null);

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [actionType, setActionType] = useState(null);

  const CORRECT_PASSWORD = "12345678";

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setShowPasswordDialog(false);
      setPassword("");
      setPasswordError("");

      if (actionType === "product") {
        setShowProductForm(!showProductForm);
      } else if (actionType === "classification") {
        setShowClassificationForm(!showClassificationForm);
      }
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleButtonClick = (type) => {
    setActionType(type);
    setShowPasswordDialog(true);
    setPassword("");
    setPasswordError("");
  };

  const handleDocumentationResponse = (hasDoc) => {
    setHasDocumentation(hasDoc);
    if (!hasDoc) {
      // If no documentation, close dialog
      setClassificationDialogOpen(false);
      setSelectedProduct(null);
      setDialogStep(1);
    } else {
      setDialogStep(2);
    }
  };

  const handleClassificationResponse = (isNH) => {
    if (selectedProduct) {
      const updatedItems = allItems.map((item) => {
        if (item.name === selectedProduct.name) {
          return {
            ...item,
            classification: isNH ? "NH" : "CM",
          };
        }
        return item;
      });
      setAllItems(updatedItems);
    }
    setClassificationDialogOpen(false);
    setSelectedProduct(null);
    setDialogStep(1);
    setHasDocumentation(null);
  };

  const handleItemClick = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item.name]: !prev[item.name],
    }));

    setSelectedProduct(item);
    setDialogStep(1);
    setHasDocumentation(null);
    setClassificationDialogOpen(true);
  };

  const handleSubmit = () => {
    const selectedItems = allItems.filter((item) => checkedItems[item.name]);

    if (selectedItems.length > 0) {
      const lowestRanked = selectedItems.reduce((lowest, current) => {
        const currentRank =
          classifications.find((c) => c.label === current.classification)
            ?.rank || 0;
        const lowestRank =
          classifications.find((c) => c.label === lowest.classification)
            ?.rank || 0;
        return currentRank < lowestRank ? current : lowest;
      }, selectedItems[0]);

      setLowestRankedProduct(lowestRanked);
    }

    setCheckedItems({});
  };

  const addProduct = (name, classification) => {
    const newProduct = {
      name,
      classification,
    };
    setAllItems([...allItems, newProduct]);
  };

  const addClassification = (label, rank) => {
    const newClassification = {
      label,
      rank: parseInt(rank),
    };
    setClassifications([...classifications, newClassification]);
  };

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    // Heading
    <Container
      sx={{ backgroundColor: "#E8E0DB", padding: "16px", borderRadius: "8px" }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Select Nail Products
      </Typography>
      <FormGroup>
        {/* All the Products */}
        <Grid container spacing={1}>
          {allItems.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.name}>
              <Typography
                variant="body1"
                sx={{
                  padding: "8px",
                  cursor: "pointer",
                  background: checkedItems[item.name]
                    ? "#806a5b"
                    : "transparent",
                  transition: "background 0.4s ease-in-out",
                  color: checkedItems[item.name] ? "white" : "black",
                  borderRadius: "4px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
                onClick={() => handleItemClick(item)}
              >
                {capitalizeName(item.name)}
                <br />
              </Typography>
            </Grid>
          ))}
        </Grid>
      </FormGroup>
      {/* Submit Button */}
      <Button
        variant="contained"
        sx={{ mt: 2, mr: 2, backgroundColor: "#806a5b", color: "white" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {/* Add Product Button */}
      <Button
        variant="outlined"
        sx={{ mt: 2, mr: 2, backgroundColor: "white", color: "#806a5b" }}
        onClick={() => setShowProductForm(!showProductForm)}
        onClick={() => handleButtonClick("product")}
      >
        {showProductForm ? "Hide" : "Add Products"}
      </Button>
      {/* Add Classification Button */}

      <Button
        variant="outlined"
        sx={{ mt: 2, backgroundColor: "white", color: "#806a5b" }}
        onClick={() => setShowClassificationForm(!showClassificationForm)}
        onClick={() => handleButtonClick("classification")}
      >
        {showClassificationForm ? "Hide" : "Add Classification"}
      </Button>
      {/* Show the Lowest ranked product */}

      {lowestRankedProduct && (
        <Typography
          sx={{ mt: 2, p: 2, backgroundColor: "white", borderRadius: "4px" }}
        >
          Lowest Ranked Product: {lowestRankedProduct.name} (
          {lowestRankedProduct.classification})
        </Typography>
      )}
      {/* Add Product form container */}
      <Collapse in={showProductForm}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Enter Nail Products
          </Typography>
          <ProductForm
            addProduct={addProduct}
            classifications={classifications}
          />
        </Container>
      </Collapse>
      {/* Add Classification form container */}

      <Collapse in={showClassificationForm}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Add New Classification
          </Typography>
          <ClassificationForm addClassification={addClassification} />
        </Container>
      </Collapse>
      {/* Classification POPUP */}
      <Dialog
        open={classificationDialogOpen}
        onClose={() => {
          setClassificationDialogOpen(false);
          setDialogStep(1);
          setHasDocumentation(null);
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#E8E0DB",
            color: "#806a5b",
          },
        }}
      >
        <DialogTitle>
          Product Classification: {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {dialogStep === 1
              ? "Does the documentation for this product exist?"
              : "Is this product classified as NH?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          {dialogStep === 1 ? (
            <>
              <Button
                onClick={() => handleDocumentationResponse(true)}
                sx={{ color: "#806a5b" }}
              >
                Yes
              </Button>
              <Button
                onClick={() => handleDocumentationResponse(false)}
                sx={{ color: "#806a5b" }}
              >
                No
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleClassificationResponse(true)}
                sx={{ color: "#806a5b" }}
              >
                Yes
              </Button>
              <Button
                onClick={() => handleClassificationResponse(false)}
                sx={{ color: "#806a5b" }}
              >
                No
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {/* Password POPUP */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setPassword("");
          setPasswordError("");
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#E8E0DB",
            color: "#806a5b",
          },
        }}
      >
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#806a5b",
                },
                "&:hover fieldset": {
                  borderColor: "#806a5b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#806a5b",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPasswordDialog(false);
              setPassword("");
              setPasswordError("");
            }}
            sx={{ color: "#806a5b" }}
          >
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} sx={{ color: "#806a5b" }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
// Add Product Form
const ProductForm = ({ addProduct, classifications }) => {
  const [name, setName] = useState("");
  const [classification, setClassification] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && classification) {
      addProduct(name, classification);
      setName("");
      setClassification("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Classification</option>
            {classifications.map((cls) => (
              <option key={cls.label} value={cls.label}>
                {cls.label}
              </option>
            ))}
          </select>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#806a5b",
              color: "white",
              "&:hover": {
                backgroundColor: "#6a5a4f",
              },
            }}
          >
            Add Product
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
// Add Classification Form
const ClassificationForm = ({ addClassification }) => {
  const [label, setLabel] = useState("");
  const [rank, setRank] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (label && rank) {
      addClassification(label, rank);
      setLabel("");
      setRank("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Classification Label"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Rank"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#806a5b",
              color: "white",
              "&:hover": {
                backgroundColor: "#6a5a4f",
              },
            }}
          >
            Add Classification
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Home;
