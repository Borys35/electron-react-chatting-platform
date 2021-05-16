import { FC } from "react";
import { communityCategories } from "../constraints";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";

interface Props {
  activeCategory: string;
  onChange: Function;
}

const CategoriesList: FC<Props> = ({ activeCategory, onChange }) => {
  return (
    <ListWrapper>
      <StandardItem
        text="All"
        onClick={() => onChange("")}
        active={!activeCategory}
      />
      {Object.values(communityCategories).map((category) => (
        <StandardItem
          text={category}
          onClick={() => onChange(category)}
          active={category === activeCategory}
        />
      ))}
    </ListWrapper>
  );
};

export default CategoriesList;
